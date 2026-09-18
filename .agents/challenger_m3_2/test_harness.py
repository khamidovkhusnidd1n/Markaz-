import os
import sys
import subprocess
import json
from pathlib import Path

# Setup Django environment
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

def test_deploy_check():
    print("=== TASK 1: Django check --deploy ===")
    res = subprocess.run(
        [sys.executable, "manage.py", "check", "--deploy"],
        cwd=backend_path,
        capture_output=True,
        text=True
    )
    print(f"Exit Code: {res.returncode}")
    print(f"Stdout:\n{res.stdout.strip()}")
    print(f"Stderr:\n{res.stderr.strip()}")
    return {
        "exit_code": res.returncode,
        "stdout": res.stdout,
        "stderr": res.stderr
    }

def test_static_admin_auth():
    print("\n=== TASK 2: StaticAdminAuthentication in production mode (DEBUG=False) ===")
    factory = APIRequestFactory()
    auth = StaticAdminAuthentication()

    results = []

    # Case 2a: Default production mode (DEBUG=False) with default token
    settings.DEBUG = False
    setattr(settings, 'ALLOW_STATIC_ADMIN_AUTH', False)
    setattr(settings, 'STATIC_ADMIN_TOKEN', 'static-admin-token')

    req = factory.get('/api/', HTTP_AUTHORIZATION='Bearer static-admin-token')
    res = auth.authenticate(req)
    print(f"DEBUG=False, token='static-admin-token' -> authenticate() returned: {res}")
    results.append({
        "scenario": "DEBUG=False, token='static-admin-token'",
        "expected": "None",
        "actual": str(res),
        "passed": res is None
    })

    # Case 2b: DEBUG=False with strong token 'custom-secret-token-99999'
    setattr(settings, 'STATIC_ADMIN_TOKEN', 'custom-secret-token-99999')
    req = factory.get('/api/', HTTP_AUTHORIZATION='Bearer custom-secret-token-99999')
    res = auth.authenticate(req)
    print(f"DEBUG=False, strong token='custom-secret-token-99999' -> authenticate() returned: {res}")
    results.append({
        "scenario": "DEBUG=False, strong token='custom-secret-token-99999'",
        "expected": "None",
        "actual": str(res),
        "passed": res is None
    })

    # Case 2c: DEBUG=False, ALLOW_STATIC_ADMIN_AUTH=True with weak token '1212'
    setattr(settings, 'ALLOW_STATIC_ADMIN_AUTH', True)
    setattr(settings, 'STATIC_ADMIN_TOKEN', '1212')
    req = factory.get('/api/', HTTP_AUTHORIZATION='Bearer 1212')
    res = auth.authenticate(req)
    print(f"DEBUG=False, ALLOW_STATIC_ADMIN_AUTH=True, weak token='1212' -> authenticate() returned: {res}")
    results.append({
        "scenario": "DEBUG=False, ALLOW_STATIC_ADMIN_AUTH=True, weak token='1212'",
        "expected": "None",
        "actual": str(res),
        "passed": res is None
    })

    # Case 2d: DEBUG=False, ALLOW_STATIC_ADMIN_AUTH=True with strong token 'secure-prod-token-xyz-123'
    setattr(settings, 'STATIC_ADMIN_TOKEN', 'secure-prod-token-xyz-123')
    req = factory.get('/api/', HTTP_AUTHORIZATION='Bearer secure-prod-token-xyz-123')
    res = auth.authenticate(req)
    print(f"DEBUG=False, ALLOW_STATIC_ADMIN_AUTH=True, strong token -> authenticate() returned: {res[0].username if res else None}")
    results.append({
        "scenario": "DEBUG=False, ALLOW_STATIC_ADMIN_AUTH=True, strong token",
        "expected": "User object",
        "actual": res[0].username if res else "None",
        "passed": res is not None and res[0].username == settings.STATIC_ADMIN_USERNAME
    })

    # Case 2e: DEBUG=True with weak token 'static-admin-token'
    settings.DEBUG = True
    setattr(settings, 'ALLOW_STATIC_ADMIN_AUTH', False)
    setattr(settings, 'STATIC_ADMIN_TOKEN', 'static-admin-token')
    req = factory.get('/api/', HTTP_AUTHORIZATION='Bearer static-admin-token')
    res = auth.authenticate(req)
    print(f"DEBUG=True, weak token='static-admin-token' -> authenticate() returned: {res}")
    results.append({
        "scenario": "DEBUG=True, weak token='static-admin-token'",
        "expected": "None",
        "actual": str(res),
        "passed": res is None
    })

    # Reset settings back
    settings.DEBUG = False
    setattr(settings, 'ALLOW_STATIC_ADMIN_AUTH', False)

    return results

def test_password_validation():
    print("\n=== TASK 3: Password Validation Settings ===")
    passwords_to_test = [
        '1212',
        '123456',
        'password',
        'admin',
        'Short1!',
        'ValidStrongPassword2026!'
    ]

    results = []

    for pwd in passwords_to_test:
        try:
            validate_password(pwd)
            print(f"Password '{pwd}': ACCEPTED")
            results.append({
                "password": pwd,
                "accepted": True,
                "errors": []
            })
        except ValidationError as e:
            print(f"Password '{pwd}': REJECTED with errors: {e.messages}")
            results.append({
                "password": pwd,
                "accepted": False,
                "errors": e.messages
            })

    return results

if __name__ == '__main__':
    deploy_res = test_deploy_check()
    auth_res = test_static_admin_auth()
    pwd_res = test_password_validation()

    summary = {
        "deploy_check": deploy_res,
        "static_admin_auth": auth_res,
        "password_validation": pwd_res
    }

    with open(r"c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\challenger_m3_2\test_results.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\nTest results written to test_results.json")
