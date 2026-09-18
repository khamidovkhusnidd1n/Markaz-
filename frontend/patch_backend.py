import re
file_path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\services\backend.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''function transformPedagogueProject(item: any): PedagogueProject {
    return {
      id: item.id,
      pedagogue: item.pedagogue,
      title: item.title_translated || item.title || '',
      description: item.description_translated || item.description || '',
      views_count: item.views_count || 0,'''

content = content.replace(
    '''function transformPedagogueProject(item: any): PedagogueProject {
    return {
      id: item.id,
      pedagogue: item.pedagogue,
      title: item.title_translated || item.title || '',
      views_count: item.views_count || 0,''',
    replacement
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('backend.ts updated')
