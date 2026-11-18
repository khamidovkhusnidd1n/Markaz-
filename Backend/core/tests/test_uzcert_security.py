import json
from django.test import TestCase, Client, override_settings
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from core.models import Application

@override_settings(SECURE_SSL_REDIRECT=False)
class UZCERTSecurityTestSuite(TestCase):
    """
    O'zbekiston Kiberxavfsizlik Markazi DUK (UZCERT) talablari bo'yicha
    kompleks xavfsizlik testlari.
    """
    def setUp(self):
        self.client = Client()
        cache.clear()

    # 1. Security Headers & Server Disclosure
    def test_01_security_headers_present(self):
        """Barcha javoblarda UZCERT talab qilgan xavfsizlik sarlavhalari bo'lishi shart."""
        response = self.client.get('/api/all-data/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Strict-Transport-Security', response.headers)
        self.assertIn('X-Frame-Options', response.headers)
        self.assertEqual(response.headers['X-Frame-Options'], 'SAMEORIGIN')
        self.assertIn('X-Content-Type-Options', response.headers)
        self.assertEqual(response.headers['X-Content-Type-Options'], 'nosniff')
        self.assertIn('Referrer-Policy', response.headers)
        self.assertIn('Permissions-Policy', response.headers)

    def test_02_server_tokens_stripped(self):
        """X-Powered-By yoki Server kabi server dasturiy ta'minotini oshkor qiluvchi sarlavhalar bo'lmasligi kerak."""
        response = self.client.get('/api/all-data/')
        self.assertNotIn('X-Powered-By', response.headers)

    # 2. SQL Injection Resistance
    def test_03_sql_injection_resistance(self):
        """Qidiruv parametrlariga SQL inyeksiya payloadlari yuborilganda 500 xatosi bo'lmasligi kerak."""
        payloads = [
            "' OR 1=1 --",
            "'; DROP TABLE core_application; --",
            "1' UNION SELECT 1, 'admin', 'pass' --",
            "' OR 'x'='x",
        ]
        for payload in payloads:
            resp = self.client.get(f'/api/applications/track/?q={payload}')
            self.assertNotEqual(resp.status_code, 500, f"SQL injection payload 500 keltirib chiqardi: {payload}")

    # 3. IDOR / BOLA Protection
    def test_04_idor_protection_on_application_track(self):
        """Arizalarni ketma-ket qisqa raqamlar (?q=1, ?q=2) bilan ommaviy ko'chirish taqiqlangan."""
        weak_queries = ['1', '2', '2026', 'a', 'test', '123']
        for q in weak_queries:
            resp = self.client.get(f'/api/applications/track/?q={q}')
            self.assertEqual(resp.status_code, 400, f"Zaif qidiruv qabul qilinmasligi kerak edi: ?q={q}")

    # 4. Brute Force Protection & Lockout
    def test_05_login_brute_force_lockout(self):
        """Ketma-ket 5 ta xato login urinishidan so'ng 15 daqiqaga bloklanishi (429) shart."""
        for attempt in range(4):
            resp = self.client.post(
                '/api/login/',
                json.dumps({'username': 'wrong_admin', 'password': 'wrong_password'}),
                content_type='application/json'
            )
            self.assertIn(resp.status_code, [400, 401, 200])

        # 5-urinishda kiberxavfsizlik blokirovkasi (429 Too Many Requests) ishga tushishi shart
        locked_resp = self.client.post(
            '/api/login/',
            json.dumps({'username': 'wrong_admin', 'password': 'wrong_password'}),
            content_type='application/json'
        )
        self.assertEqual(locked_resp.status_code, 429, "5-xato urinishda 429 bloklanishi shart")

    # 5. File Upload Security
    def test_06_malicious_file_upload_blocked(self):
        """Fayl yuklashda xavfli kengaytmali (.php, .exe, .sh) fayllar qat'iy rad etilishi shart."""
        malicious_file = SimpleUploadedFile(
            "shell.php",
            b"<?php echo 'HACKED'; ?>",
            content_type="application/x-php"
        )
        app = Application(
            application_type='retraining',
            direction='Rangtasvir',
            workplace='Toshkent',
            full_name='Test Xaker',
            phone='+998901234567',
            diploma_file=malicious_file
        )
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            app.full_clean()

    # 6. Sensitive Data Exposure in API
    def test_07_no_passwords_or_secrets_in_all_data(self):
        """Ochiq API javoblarida parollar, tokenlar yoki maxfiy kalitlar chiqmasligi shart."""
        resp = self.client.get('/api/all-data/')
        self.assertEqual(resp.status_code, 200)
        content = resp.content.decode('utf-8').lower()
        self.assertNotIn('password', content)
        self.assertNotIn('secret_key', content)
        self.assertNotIn('token_obtain', content)

    # 7. Clean 404/500 Handlers (No Information Leak)
    @override_settings(DEBUG=False)
    def test_08_clean_404_handler(self):
        """Mavjud bo'lmagan sahifada Django traceback yoki URLconf marshrutlari oshkor bo'lmasligi shart."""
        resp = self.client.get('/api/test-nonexistent-endpoint-xyz/')
        self.assertEqual(resp.status_code, 404)
        body = resp.content.decode('utf-8')
        self.assertNotIn('Using the URLconf defined in', body)
        self.assertNotIn('Traceback', body)
        self.assertNotIn('Environment:', body)

    # 8. XSS Protection
    def test_09_xss_payload_in_appeal(self):
        """Murojaat yuborishda XSS skriptlar 500 bermasligi va xavfsiz saqlanishi kerak."""
        xss_payload = "<script>alert('XSS')</script>"
        resp = self.client.post('/api/appeals/', {
            'full_name': 'XSS Tester',
            'phone': '+998901234567',
            'email': 'xss@test.uz',
            'appeal_type': 'taklif',
            'description': xss_payload
        })
        self.assertIn(resp.status_code, [200, 201])

    # 9. Voting Rate Limit (Business Flow Protection)
    def test_10_voting_rate_limit(self):
        """Loyihalarga bir IP dan qayta-qayta cheksiz ovoz berish bloklanishi kerak."""
        from core.models import PedagogueProject, Pedagogue
        ped = Pedagogue.objects.create(full_name="Test Ustoz", order=1)
        proj = PedagogueProject.objects.create(pedagogue=ped, title="Test Loyiha")

        # 1-ovoz muvaffaqiyatli
        resp1 = self.client.post(f'/api/pedagogue-projects/{proj.id}/vote/')
        self.assertEqual(resp1.status_code, 200)

        # 2-ovoz shu zahoti rad etilishi kerak (429)
        resp2 = self.client.post(f'/api/pedagogue-projects/{proj.id}/vote/')
        self.assertEqual(resp2.status_code, 429)

    # 10. Anti-Spoofing Client IP Extraction
    def test_11_xff_spoofing_resistance(self):
        """Attacker cannot bypass rate limit/lockout by spoofing leftmost X-Forwarded-For."""
        from core.client_ip import get_client_ip
        from django.test import RequestFactory
        rf = RequestFactory()

        # Attacker injects fake IPs in X-Forwarded-For
        req = rf.get('/api/login/', HTTP_X_FORWARDED_FOR='1.2.3.4, 5.6.7.8, 192.168.1.1', REMOTE_ADDR='10.0.0.1')
        ip = get_client_ip(req)
        self.assertNotEqual(ip, '1.2.3.4')

    # 11. Strict CSP on API
    def test_12_api_csp_strict(self):
        """API endpoints must return strict CSP default-src 'none'."""
        resp = self.client.get('/api/all-data/')
        self.assertIn('Content-Security-Policy', resp.headers)
        self.assertIn("default-src 'none'", resp.headers['Content-Security-Policy'])

    # 12. PII Harvest Protection
    def test_13_training_plan_pii_not_in_all_data(self):
        """all-data must not leak complete training plan database."""
        from core.models import TrainingPlanRecord
        TrainingPlanRecord.objects.create(
            full_name="Secret Trainee",
            workplace="Sensitive School",
            course_name="Fine Arts"
        )
        resp = self.client.get('/api/all-data/')
        data = resp.json()
        self.assertEqual(data.get('training_plan_records'), [])

    # 13. Training Plan Search Query Validation
    def test_14_training_plan_search_validation(self):
        """Search query must be at least 3 characters."""
        resp_short = self.client.get('/api/training-plan/search/?q=ab')
        self.assertEqual(resp_short.status_code, 400)

        resp_valid = self.client.get('/api/training-plan/search/?q=Secret')
        self.assertEqual(resp_valid.status_code, 200)

    # 14. File Upload Magic Bytes Validation
    def test_15_disguised_file_upload_blocked(self):
        """A text/script file disguised with .pdf extension must fail magic bytes validation."""
        fake_pdf = SimpleUploadedFile(
            "document.pdf",
            b"Plain text payload without PDF header",
            content_type="application/pdf"
        )
        app = Application(
            application_type='retraining',
            direction='Rangtasvir',
            workplace='Toshkent',
            full_name='Disguised Attacker',
            phone='+998901234567',
            diploma_file=fake_pdf
        )
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            app.full_clean()

