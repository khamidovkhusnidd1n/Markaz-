import re
file_path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\admin.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "'pedagogue', 'title', 'title_ru', 'title_en',",
    "'pedagogue', 'title', 'title_ru', 'title_en', 'description', 'description_ru', 'description_en',"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('admin.py updated')
