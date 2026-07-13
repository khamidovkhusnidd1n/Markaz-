import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')
django.setup()

from rest_framework.test import APIClient
from core.models import Course, Personnel, AppContent

def check_endpoint_translations():
    client = APIClient()
    languages = ['uz', 'ru', 'en']
    
    print("==================================================")
    print("Testing Translation Support across endpoints")
    print("==================================================")
    
    # 1. Test Courses Endpoint
    print("\n--- Testing /api/courses/ ---")
    for lang in languages:
        response = client.get(f'/api/courses/?lang={lang}')
        if response.status_code == 200:
            results = response.data.get('results', response.data)
            if results and len(results) > 0:
                first_course = results[0]
                print(f"[{lang.upper()}] Title: {first_course.get('title')}")
                print(f"[{lang.upper()}] Title Translated: {first_course.get('title_translated')}")
                print(f"[{lang.upper()}] Description Translated: {first_course.get('description_translated')[:60]}...")
            else:
                print(f"[{lang.upper()}] No course data found")
        else:
            print(f"[{lang.upper()}] Failed with status {response.status_code}")
            
    # 2. Test Personnel Endpoint
    print("\n--- Testing /api/personnel/ ---")
    for lang in languages:
        response = client.get(f'/api/personnel/?lang={lang}')
        if response.status_code == 200:
            results = response.data.get('results', response.data)
            if results and len(results) > 0:
                first_person = results[0]
                print(f"[{lang.upper()}] Full Name: {first_person.get('full_name')}")
                print(f"[{lang.upper()}] Position Translated: {first_person.get('position_translated')}")
            else:
                print(f"[{lang.upper()}] No personnel data found")
        else:
            print(f"[{lang.upper()}] Failed with status {response.status_code}")
            
    # 3. Test AppContent Endpoint (Markaz haqida / content)
    print("\n--- Testing /api/content/ (AppContent direct endpoint) ---")
    for lang in languages:
        response = client.get(f'/api/content/?lang={lang}')
        if response.status_code == 200:
            data = response.data
            print(f"[{lang.upper()}] Site Name Translated: {data.get('site_name_translated')}")
            print(f"[{lang.upper()}] History Translated: {data.get('history_translated')[:60]}...")
        else:
            print(f"[{lang.upper()}] Failed with status {response.status_code}")
            
    # 4. Test NewsCategory Endpoint
    print("\n--- Testing /api/news-categories/ ---")
    for lang in languages:
        response = client.get(f'/api/news-categories/?lang={lang}')
        if response.status_code == 200:
            results = response.data.get('results', response.data)
            if results and len(results) > 0:
                first_cat = results[0]
                print(f"[{lang.upper()}] Name Translated: {first_cat.get('name_translated')}")
            else:
                print(f"[{lang.upper()}] No category data found")
        else:
            print(f"[{lang.upper()}] Failed with status {response.status_code}")

    # 5. Test ArtGalleryItem Endpoint
    print("\n--- Testing /api/art-gallery/ ---")
    for lang in languages:
        response = client.get(f'/api/art-gallery/?lang={lang}')
        if response.status_code == 200:
            results = response.data.get('results', response.data)
            if results and len(results) > 0:
                first_item = results[0]
                print(f"[{lang.upper()}] Title Translated: {first_item.get('title_translated')}")
            else:
                print(f"[{lang.upper()}] No art gallery data found")
        else:
            print(f"[{lang.upper()}] Failed with status {response.status_code}")

    # 6. Test InternationalProject Endpoint
    print("\n--- Testing /api/international-projects/ ---")
    for lang in languages:
        response = client.get(f'/api/international-projects/?lang={lang}')
        if response.status_code == 200:
            results = response.data.get('results', response.data)
            if results and len(results) > 0:
                first_proj = results[0]
                print(f"[{lang.upper()}] Title Translated: {first_proj.get('title_translated')}")
            else:
                print(f"[{lang.upper()}] No international project data found")
        else:
            print(f"[{lang.upper()}] Failed with status {response.status_code}")

    # 7. Test All Data Endpoint
    print("\n--- Testing /api/all-data/ ---")
    for lang in languages:
        response = client.get(f'/api/all-data/?lang={lang}')
        if response.status_code == 200:
            data = response.data
            
            # courses
            courses = data.get('courses', [])
            first_course = courses[0] if courses else {}
            print(f"[{lang.upper()}] Course: {first_course.get('title_translated')}")
            
            # personnel
            personnel = data.get('personnel', [])
            first_person = personnel[0] if personnel else {}
            print(f"[{lang.upper()}] Person Position: {first_person.get('position_translated')}")
            
            # about (AppContent inside all-data)
            about = data.get('about', {})
            print(f"[{lang.upper()}] About Site Name: {about.get('site_name_translated')}")
            
            # internationalProjects inside all-data
            int_projs = data.get('internationalProjects', [])
            first_proj = int_projs[0] if int_projs else {}
            print(f"[{lang.upper()}] All-Data International Project: {first_proj.get('title_translated')}")
        else:
            print(f"[{lang.upper()}] Failed with status {response.status_code}")

if __name__ == '__main__':
    import io
    original_stdout = sys.stdout
    # Redirect stdout to verify_report.txt in UTF-8
    with open('verify_report.txt', 'w', encoding='utf-8') as f:
        sys.stdout = f
        check_endpoint_translations()
    sys.stdout = original_stdout
    print("Report written to verify_report.txt successfully!")
