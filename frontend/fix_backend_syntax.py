import re

file_path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\services\backend.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken lines
content = content.replace(
    "const res = await fetch(${baseUrl}/projects//view/, { method: 'POST' });",
    "const res = await fetch(`${baseUrl}/projects/${projectId}/view/`, { method: 'POST' });"
)
content = content.replace(
    "const res = await fetch(${baseUrl}/projects//vote/, { method: 'POST' });",
    "const res = await fetch(`${baseUrl}/projects/${projectId}/vote/`, { method: 'POST' });"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("backend.ts fixed!")
