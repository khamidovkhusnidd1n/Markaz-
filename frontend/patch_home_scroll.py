import re
path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\pages\Home.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">.*?</div>\s*</div>',
    '',
    content,
    flags=re.DOTALL
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Removed scroll down icon')
