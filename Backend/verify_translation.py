import os
import django
import sys

# Setup django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')
django.setup()

from rest_framework.test import APIClient

def run_tests():
    client = APIClient()
    
    # Let's seed db first to make sure database is populated
    from django.core.management import call_command
    print("Seeding database...")
    call_command('seed_db')
    
    endpoints = [
        ('/api/courses/', 'title', 'title_translated'),
        ('/api/personnel/', 'position', 'position_translated'),
        ('/api/content/', 'history', 'history_translated'),
    ]
    
    print("\n--- Running Translation Verification ---")
    
    all_passed = True
    
    for url_path, orig_field, trans_field in endpoints:
        print(f"\nTesting endpoint: {url_path}")
        
        # Test UZ
        resp_uz = client.get(url_path, {'lang': 'uz'})
        # Test RU
        resp_ru = client.get(url_path, {'lang': 'ru'})
        # Test EN
        resp_en = client.get(url_path, {'lang': 'en'})
        # Test Default (no lang)
        resp_def = client.get(url_path)
        # Test Invalid lang
        resp_inv = client.get(url_path, {'lang': 'fr'})
        
        # Parse data
        data_uz = resp_uz.data['results'] if isinstance(resp_uz.data, dict) and 'results' in resp_uz.data else resp_uz.data
        data_ru = resp_ru.data['results'] if isinstance(resp_ru.data, dict) and 'results' in resp_ru.data else resp_ru.data
        data_en = resp_en.data['results'] if isinstance(resp_en.data, dict) and 'results' in resp_en.data else resp_en.data
        data_def = resp_def.data['results'] if isinstance(resp_def.data, dict) and 'results' in resp_def.data else resp_def.data
        data_inv = resp_inv.data['results'] if isinstance(resp_inv.data, dict) and 'results' in resp_inv.data else resp_inv.data
        
        # Check list not empty
        if not data_uz:
            print(f"ERROR: No data returned from {url_path}")
            all_passed = False
            continue
            
        # Get first item
        item_uz = data_uz[0] if isinstance(data_uz, list) else data_uz
        item_ru = data_ru[0] if isinstance(data_ru, list) else data_ru
        item_en = data_en[0] if isinstance(data_en, list) else data_en
        item_def = data_def[0] if isinstance(data_def, list) else data_def
        item_inv = data_inv[0] if isinstance(data_inv, list) else data_inv
        
        print(f"Original field: '{orig_field}' = {item_uz.get(orig_field)}")
        print(f"UZ {trans_field}: {item_uz.get(trans_field)}")
        print(f"RU {trans_field}: {item_ru.get(trans_field)}")
        print(f"EN {trans_field}: {item_en.get(trans_field)}")
        print(f"Default {trans_field}: {item_def.get(trans_field)}")
        print(f"Invalid {trans_field}: {item_inv.get(trans_field)}")
        
        try:
            assert item_uz.get(trans_field) == item_uz.get(orig_field), "UZ translation mismatch"
            assert item_def.get(trans_field) == item_uz.get(orig_field), "Default translation mismatch"
            assert item_inv.get(trans_field) == item_uz.get(orig_field), "Invalid lang fallback mismatch"
        except AssertionError as e:
            print(f"ERROR: Validation failed: {e}")
            all_passed = False
            continue
        
        # Check RU/EN are different or have suffixes
        ru_val = item_ru.get(trans_field)
        en_val = item_en.get(trans_field)
        uz_val = item_uz.get(orig_field)
        
        if ru_val == uz_val:
            print(f"WARNING: RU translation is same as UZ for {url_path} ({uz_val})")
        else:
            print(f"SUCCESS: RU translation is different: {ru_val}")
            
        if en_val == uz_val:
            print(f"WARNING: EN translation is same as UZ for {url_path} ({uz_val})")
        else:
            print(f"SUCCESS: EN translation is different: {en_val}")
            
    # Check all-data endpoint too
    print("\nTesting endpoint: /api/all-data/")
    for lang in ['uz', 'ru', 'en']:
        resp = client.get('/api/all-data/', {'lang': lang})
        if resp.status_code != 200:
            print(f"ERROR: /api/all-data/ failed with status {resp.status_code} for lang={lang}")
            all_passed = False
        else:
            print(f"SUCCESS: /api/all-data/ returns 200 for lang={lang}")
            courses = resp.data.get('courses', [])
            if courses:
                print(f"  First course title_translated ({lang}): {courses[0].get('title_translated')}")

    if all_passed:
        print("\nALL TRANSLATION TESTS PASSED!")
        sys.exit(0)
    else:
        print("\nSOME TRANSLATION TESTS FAILED!")
        sys.exit(1)

if __name__ == '__main__':
    run_tests()
