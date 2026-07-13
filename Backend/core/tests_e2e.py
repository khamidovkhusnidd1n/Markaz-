import os
import re
from django.test import override_settings
from django.conf import settings
from django.urls import re_path
from django.views.static import serve
from rest_framework import status
from rest_framework.test import APITestCase
from markaz_backend.urls import urlpatterns as main_urlpatterns

# Override ROOT_URLCONF using this module to serve media files directly during test execution
urlpatterns = main_urlpatterns + [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

@override_settings(ROOT_URLCONF='core.tests_e2e')
class E2ETestSuite(APITestCase):
    """
    E2E Test Suite programmatically verifying:
    - R1: Content population for courses, personnel, and app content.
    - R2: Document integration (GET returns 200 OK).
    - Absence of placeholders in frontend Students.tsx and Portfolio.tsx.
    """

    @classmethod
    def setUpTestData(cls):
        from pathlib import Path
        fallback_source_path = r"C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt"
        dynamic_source_path = Path(settings.BASE_DIR).parent.parent.parent / "eskisayttexts.txt"
        if dynamic_source_path.exists():
            cls.source_text_path = str(dynamic_source_path)
        else:
            cls.source_text_path = fallback_source_path

        if os.path.exists(cls.source_text_path):
            with open(cls.source_text_path, 'r', encoding='utf-8') as f:
                cls.source_text = f.read()
        else:
            cls.source_text = ""
        
        from django.core.management import call_command
        call_command('seed_db')

    def parse_expected_courses(self):
        courses = []
        if not self.source_text:
            return courses
        for line in self.source_text.splitlines():
            line = line.strip()
            if "soat" in line:
                match = re.match(r"^(.*?)\s+\d+\s+soat", line)
                if match:
                    courses.append(match.group(1).strip())
                else:
                    courses.append(line)
        return list(dict.fromkeys(courses))

    def test_courses_api(self):
        """Verify that all expected courses from the Uzbek source text are populated and exposed via API."""
        self.assertTrue(os.path.exists(self.source_text_path), f"Source text file not found at {self.source_text_path}")
        
        expected_courses = self.parse_expected_courses()
        self.assertGreater(len(expected_courses), 0, "No courses could be parsed from the source text file")
        
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        results = data['results'] if isinstance(data, dict) and 'results' in data else data
        
        self.assertGreater(len(results), 0, "No courses found in the database API response. Database is not populated.")
        
        response_titles = [item['title'] for item in results]
        for course_title in expected_courses:
            self.assertIn(course_title, response_titles, f"Expected course '{course_title}' not found in API response")

    def test_personnel_api(self):
        """Verify that all 16 personnel names from the Uzbek source text are populated and exposed via API."""
        self.assertTrue(os.path.exists(self.source_text_path), f"Source text file not found at {self.source_text_path}")
        
        expected_personnel = [
            'Shukurov Davronbek Shukurovich',
            'Sharipov Azmiddin Najmiddin oʻgʻli',
            'Akramova Lobar Rixsitullayevna',
            'Yeshchanov Oybek Shukurlayevich',
            "Xamidov Xusniddin Tolibjon o'g'li",
            "Xasanova Nodira A'zam qizi",
            'Shuhratov Shohruh Shuhrat o‘g\'li',
            'Xushboqova Madina',
            'To‘rayeva Dilnoza Ismatulla qizi',
            "Husanboyev Shohjaxon Sherzod o'g'li",
            "Jonimboyeva Guldona O'ktamjon qizi",
            'Mamarasulova Dilnavoz Baxtiyor qizi',
            'Sattorov Abdumalik Abdug’affor o’g’li',
            'Sulaymonov Otabek Oybek o‘g‘li',
            'Nurmaxammatov Ibroxim Bahrom o‘g‘li',
            "Hayitov Sahobiddin Omon o'g'li"
        ]
        
        for name in expected_personnel:
            self.assertIn(name, self.source_text, f"Personnel name '{name}' not found in source text file")
            
        response = self.client.get('/api/personnel/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        results = data['results'] if isinstance(data, dict) and 'results' in data else data
        
        self.assertGreater(len(results), 0, "No personnel found in the database API response. Database is not populated.")
        
        response_names = [item['full_name'] for item in results]
        for name in expected_personnel:
            self.assertIn(name, response_names, f"Expected personnel '{name}' not found in API response")

    def test_content_api(self):
        """Verify that key phrases about the center are populated and exposed via API."""
        self.assertTrue(os.path.exists(self.source_text_path), f"Source text file not found at {self.source_text_path}")
        
        expected_phrases = [
            'O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni',
            'Tasviriy va amaliy san’at sohasi samaradorlini anada oshirishga doir chora-tadbirlar to‘g‘risida',
            'Markazda 7 ta badiiy ta’lim yo‘nalishlarida malaka oshirish hamda 6 ta qayta tayyorlash'
        ]
        
        for phrase in expected_phrases:
            self.assertIn(phrase, self.source_text, f"Key phrase '{phrase}' not found in source text file")
            
        response = self.client.get('/api/content/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response_json_str = str(response.data)
        
        for phrase in expected_phrases:
            self.assertIn(phrase, response_json_str, f"Key phrase '{phrase}' not found in AppContent API response")

    def test_documents_api_and_media_serving(self):
        """Verify that documents are populated and the media links are accessible returning 200 OK."""
        response = self.client.get('/api/documents/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        results = data['results'] if isinstance(data, dict) and 'results' in data else data
        
        self.assertGreater(len(results), 0, "No documents found in the database API response. Database is not populated.")
        
        for document in results:
            file_url = document.get('file_url')
            self.assertIsNotNone(file_url, f"Document ID {document.get('id')} has no file_url")
            
            if file_url.startswith('http'):
                from urllib.parse import urlparse
                path = urlparse(file_url).path
            else:
                path = file_url
                
            file_response = self.client.get(path)
            self.assertEqual(
                file_response.status_code, 
                status.HTTP_200_OK, 
                f"Failed to fetch document file at {path}. Status code: {file_response.status_code}"
            )

    def test_frontend_placeholders(self):
        """Assert that no placeholder texts like 'Tez kunda' exist in frontend pages."""
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        project_root = os.path.dirname(base_dir)
        
        students_path = os.path.join(project_root, 'frontend', 'pages', 'Students.tsx')
        portfolio_path = os.path.join(project_root, 'frontend', 'pages', 'Portfolio.tsx')
        
        self.assertTrue(os.path.exists(students_path), f"Students.tsx not found at {students_path}")
        self.assertTrue(os.path.exists(portfolio_path), f"Portfolio.tsx not found at {portfolio_path}")
        
        with open(students_path, 'r', encoding='utf-8') as f:
            students_content = f.read()
        with open(portfolio_path, 'r', encoding='utf-8') as f:
            portfolio_content = f.read()
            
        self.assertNotIn("Tez kunda", students_content, "Placeholder 'Tez kunda' found in Students.tsx")
        self.assertNotIn("Tez kunda", portfolio_content, "Placeholder 'Tez kunda' found in Portfolio.tsx")

    def test_translation_fallback_and_context(self):
        """Verify that translation fallbacks are clean (no bracketed suffixes) and lang context is passed to AppContent."""
        # Test AppContent view with lang=ru
        response_ru = self.client.get('/api/content/?lang=ru')
        self.assertEqual(response_ru.status_code, status.HTTP_200_OK)
        # Verify that the site_name_translated does not contain '(RU)'
        self.assertNotIn('(RU)', response_ru.data.get('site_name_translated', ''))
        self.assertNotIn('(EN)', response_ru.data.get('site_name_translated', ''))
        # It should cleanly fall back to the original text
        self.assertEqual(
            response_ru.data.get('site_name_translated'),
            response_ru.data.get('site_name')
        )

        # Test Course view with lang=ru to verify dictionary translation works
        response_courses = self.client.get('/api/courses/?lang=ru')
        self.assertEqual(response_courses.status_code, status.HTTP_200_OK)
        results = response_courses.data.get('results', response_courses.data)
        
        # Find the course 'Badiiy kashtachilik usta-rassomi'
        target_course = next((c for c in results if c['title'] == 'Badiiy kashtachilik usta-rassomi'), None)
        self.assertIsNotNone(target_course, "Target course not found in courses API")
        self.assertEqual(target_course.get('title_translated'), 'Мастер-художник по художественной вышивке')
