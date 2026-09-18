import os

with open("frontend/services/backend.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Force localhost to never use prod cache
fix = """
    if (isLocalHost) {
      safeStorageRemove(API_URL_CACHE_KEY); // FORCE CLEAR CACHE ON LOCALHOST
      candidates.add(`${origin}/api`);
      candidates.add(`${protocol}//127.0.0.1:8000/api`);
      candidates.add(`${protocol}//127.0.0.1:8001/api`);
      candidates.add('http://localhost:8000/api');
      candidates.add('http://localhost:8001/api');
      return Array.from(candidates);
    }
"""

if "FORCE CLEAR CACHE ON LOCALHOST" not in content:
    content = content.replace("""
    if (isLocalHost) {
      candidates.add(`${origin}/api`);
      candidates.add(`${protocol}//127.0.0.1:8000/api`);
      candidates.add(`${protocol}//127.0.0.1:8001/api`);
      candidates.add('http://localhost:8000/api');
      candidates.add('http://localhost:8001/api');
      return Array.from(candidates);
    }
""", fix)

    with open("frontend/services/backend.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Backend cache fix applied")
