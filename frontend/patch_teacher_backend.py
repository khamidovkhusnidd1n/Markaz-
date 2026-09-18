import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\services\backend.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add biography to Teacher parser
teacher_pattern = r"      awards_translated: item.awards_translated \|\| '',"
teacher_replacement = r"""      awards_translated: item.awards_translated || '',
      biography: item.biography || '',
      biography_translated: item.biography_translated || '',"""

content = re.sub(teacher_pattern, teacher_replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("backend.ts patched.")
