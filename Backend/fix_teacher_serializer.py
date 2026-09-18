import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\serializers.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix TeacherSerializer
pattern = r"    def get_awards_translated\(self, obj\):\n        return get_translated\(obj, 'awards', self\.context\.get\('lang', 'uz'\)\)\n"
replacement = r"""    def get_awards_translated(self, obj):
        return get_translated(obj, 'awards', self.context.get('lang', 'uz'))

    def get_biography_translated(self, obj):
        return get_translated(obj, 'biography', self.context.get('lang', 'uz'))
"""
content = re.sub(pattern, replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("serializers.py fixed.")
