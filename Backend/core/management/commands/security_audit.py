import os
import sys
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = "O'zbekiston Kiberxavfsizlik Markazi DUK ekspertizasi uchun tizim xavfsizligini to'liq tekshirish"

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("\n" + "="*65))
        self.stdout.write(self.style.MIGRATE_HEADING("  KIBERXAVFSIZLIK MARKAZI EKSPERTIZASI OLDIDAN AUDIT HISOBOTI"))
        self.stdout.write(self.style.MIGRATE_HEADING("="*65 + "\n"))

        issues = []
        warnings = []
        passed = []

        # 1. DEBUG Status
        if settings.DEBUG:
            issues.append(
                "CRITICAL: DEBUG = True! Kiberxavfsizlik markazi ekspertizasida darhol rad etiladi. "
                "Serverdagi .env faylda DEBUG=False deb o'rnating!"
            )
        else:
            passed.append("DEBUG = False (Production rejimi xavfsiz yoqilgan)")

        # 2. SECRET_KEY
        sk = getattr(settings, 'SECRET_KEY', '')
        if not sk or len(sk) < 30 or 'django-insecure' in sk:
            issues.append("CRITICAL: SECRET_KEY zaif yoki standart qiymatda. Kuchli 50+ belgili kalit o'rnating.")
        else:
            passed.append("SECRET_KEY kuchli va xavfsiz uzunlikda")

        # 3. ALLOWED_HOSTS
        allowed = getattr(settings, 'ALLOWED_HOSTS', [])
        if '*' in allowed and not settings.DEBUG:
            issues.append("HIGH: ALLOWED_HOSTS da '*' mavjud. Faqat 'uzbamalaka.uz' va 'www.uzbamalaka.uz' qoldiring.")
        elif 'uzbamalaka.uz' in allowed:
            passed.append("ALLOWED_HOSTS to'g'ri sozlangan (uzbamalaka.uz)")
        else:
            warnings.append("ALLOWED_HOSTS da 'uzbamalaka.uz' domenini tekshiring")

        # 4. HTTPS / HSTS & SSL Settings
        if getattr(settings, 'SECURE_SSL_REDIRECT', False):
            passed.append("SECURE_SSL_REDIRECT faol (HTTPS ga majburiy yo'naltirish)")
        else:
            warnings.append("SECURE_SSL_REDIRECT o'chirilgan (agar Nginx orqali qilinsa normal, aks holda yoqilsin)")

        if getattr(settings, 'SECURE_HSTS_SECONDS', 0) >= 2592000:
            passed.append(f"HSTS faol: {settings.SECURE_HSTS_SECONDS} soniya")
        else:
            warnings.append("SECURE_HSTS_SECONDS kamida 31536000 (1 yil) bo'lishi tavsiya etiladi")

        # 5. Cookie Security
        if getattr(settings, 'SESSION_COOKIE_SECURE', False):
            passed.append("SESSION_COOKIE_SECURE = True")
        else:
            issues.append("HIGH: SESSION_COOKIE_SECURE = False. HTTPS cookie o'g'irlanishi mumkin.")

        if getattr(settings, 'CSRF_COOKIE_SECURE', False):
            passed.append("CSRF_COOKIE_SECURE = True")
        else:
            issues.append("HIGH: CSRF_COOKIE_SECURE = False.")

        if getattr(settings, 'SESSION_COOKIE_HTTPONLY', True):
            passed.append("SESSION_COOKIE_HTTPONLY = True (XSS cookie o'g'irlash himoyasi)")
        else:
            issues.append("HIGH: SESSION_COOKIE_HTTPONLY = False.")

        # 6. Security Headers
        if getattr(settings, 'SECURE_CONTENT_TYPE_NOSNIFF', False):
            passed.append("X-Content-Type-Options: nosniff faol")
        else:
            warnings.append("SECURE_CONTENT_TYPE_NOSNIFF ni True qiling")

        if getattr(settings, 'X_FRAME_OPTIONS', '') in ['DENY', 'SAMEORIGIN']:
            passed.append(f"X-Frame-Options: {settings.X_FRAME_OPTIONS} (Clickjacking himoyasi)")
        else:
            issues.append("HIGH: X-Frame-Options sozlanmagan.")

        # 7. Media Execution Protection
        media_root = Path(settings.MEDIA_ROOT)
        media_htaccess = media_root / '.htaccess'
        if media_htaccess.exists():
            passed.append(f"Media papkada .htaccess mavjud (Skriptlar bajarilishi bloklangan): {media_htaccess}")
        else:
            warnings.append(f"Media papkada .htaccess topilmadi: {media_htaccess}")

        # 8. Templates for 404 and 500
        tpl_dir = Path(settings.BASE_DIR) / 'templates'
        if (tpl_dir / '404.html').exists() and (tpl_dir / '500.html').exists():
            passed.append("404.html va 500.html xavfsiz shablonlari mavjud (ichki yo'llar oshkor bo'lmaydi)")
        else:
            warnings.append("Maxsus 404.html va 500.html shablonlarini yarating")

        # Output Results
        self.stdout.write(self.style.SUCCESS(f"[+] O'tgan xavfsizlik tekshiruvlari ({len(passed)} ta):"))
        for p in passed:
            self.stdout.write(f"   ✓ {p}")

        if warnings:
            self.stdout.write(self.style.WARNING(f"\n[!] Ogohlantirishlar ({len(warnings)} ta):"))
            for w in warnings:
                self.stdout.write(f"   ⚠ {w}")

        if issues:
            self.stdout.write(self.style.ERROR(f"\n[-] DIQQAT: KRITIK VA YUQORI XAVFLAR ({len(issues)} ta):"))
            for i in issues:
                self.stdout.write(f"   ✗ {i}")
            self.stdout.write(self.style.ERROR("\nEKSPERTIZADAN O'TISH TAXMINI: RAD ETILISH EHTIMOLI YUQORI. Xatolarni tuzating!"))
        else:
            self.stdout.write(self.style.SUCCESS("\n" + "="*65))
            self.stdout.write(self.style.SUCCESS("  TABRIKLAYMIZ! TIZIM EKSPERTIZADAN O'TISHGA 100% TAYYOR!"))
            self.stdout.write(self.style.SUCCESS("="*65 + "\n"))
