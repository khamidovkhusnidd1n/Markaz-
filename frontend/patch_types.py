import re
file_path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\types.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''export interface PedagogueProject {
  id: number;
  title: string;
  title_ru?: string;
  title_en?: string;
  description?: string;
  description_ru?: string;
  description_en?: string;'''

content = content.replace(
    'export interface PedagogueProject {\n  id: number;\n  title: string;\n  title_ru?: string;\n  title_en?: string;',
    replacement
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('types.ts updated')
