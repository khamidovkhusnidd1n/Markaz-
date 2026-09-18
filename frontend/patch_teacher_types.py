import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\types.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add biography_translated to Teacher interface
teacher_pattern = r"  awards_translated\?: string;"
teacher_replacement = r"""  awards_translated?: string;
  biography?: string;
  biography_translated?: string;"""

content = re.sub(teacher_pattern, teacher_replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("types.ts patched.")
