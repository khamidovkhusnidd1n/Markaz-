import os
import sys
import json
from pathlib import Path

backend_path = Path(r"c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend")
sys.path.insert(0, str(backend_path))
os.chdir(backend_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')

import django
django.setup()

from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.test import APIRequestFactory
from core.authentication import StaticAdminAuthentication

def test_edge_cases():
    factory = APIRequestFactory()
    auth = StaticAdminAuthentication()

    print("=== STRESS TESTING EDGE CASES ===")
    
    # Edge case 1: Malformed headers under DEBUG=True with valid token
    settings.DEBUG = True
    setattr(settings, 'STATIC_ADMIN_TOKEN', 'valid-secret-token-777')
    
    headers_to_test = [
        ('bearer valid-secret-token-777', "lowercase bearer prefix"),
        ('Bearer  valid-secret-token-777', "double space"),
        ('Token valid-secret-token-777', "Token prefix"),
        ('Bearer valid-secret-token-777 ', "trailing space"),
        ('Bearer valid-secret-token-777\n', "newline character"),
        ('', "empty header"),
    ]
    
    for h_val, desc in headers_to_test:
        req = factory.get('/api/', HTTP_AUTHORIZATION=h_val)
        res = auth.authenticate(req)
        print(f"Header '{h_val}' ({desc}) -> authenticate(): {res}")
        assert res is None, f"Expected None for header variant '{h_val}'"

    # Edge case 2: Weak password boundary testing
    weak_passwords = [
        '1212',
        '1',
        '1234567', # 7 chars (just below 8)
        '00000000', # 8 numeric digits
        'qwertyui', # 8 chars common
        '  1212  ', # whitespace padded
    ]
    
    for pwd in weak_passwords:
        try:
            validate_password(pwd)
            print(f"Password '{pwd}' ACCEPTED (FAIL)")
        except ValidationError as e:
            print(f"Password '{repr(pwd)}' REJECTED: {e.messages}")

if __name__ == '__main__':
    test_edge_cases()
