import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\serializers.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add biography_translated to TeacherSerializer
serializer_pattern = r"    awards_translated = serializers.SerializerMethodField\(\)"
serializer_replacement = r"""    awards_translated = serializers.SerializerMethodField()
    biography_translated = serializers.SerializerMethodField()"""

content = re.sub(serializer_pattern, serializer_replacement, content, count=1)

# Add to fields list
fields_pattern = r"            'awards', 'awards_ru', 'awards_en', 'awards_translated',"
fields_replacement = r"""            'awards', 'awards_ru', 'awards_en', 'awards_translated',
            'biography', 'biography_ru', 'biography_en', 'biography_translated',"""
content = re.sub(fields_pattern, fields_replacement, content, count=1)

# Add get_biography_translated method
method_pattern = r"    def get_awards_translated\(self, obj\):\n        return self\._get_translated_field\(obj, 'awards'\)"
method_replacement = r"""    def get_awards_translated(self, obj):
        return self._get_translated_field(obj, 'awards')

    def get_biography_translated(self, obj):
        return self._get_translated_field(obj, 'biography')"""
content = re.sub(method_pattern, method_replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("serializers.py patched.")
