import re
path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\pages\Home.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make hero title smaller on very small screens
content = content.replace('text-5xl md:text-7xl', 'text-4xl md:text-5xl lg:text-7xl')

# Make paddings responsive in Reestr Result
content = content.replace('bg-white p-8 rounded-3xl', 'bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl')
content = content.replace('grid grid-cols-2 gap-4', 'grid grid-cols-1 sm:grid-cols-2 gap-4')

# Make footer columns responsive
# Wait, footer is in App.tsx or Layout.tsx? Let's check Layout.tsx later.

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Applied basic responsive fixes to Home.tsx')
