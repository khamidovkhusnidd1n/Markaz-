import os
path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\pages\Home.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the official page badge
badge_code = '''              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold tracking-wide">{t('home.official_page')}</span>
              </div>'''

# The line in Home.tsx actually wraps at `border border-white/20`. Let's use regex.
import re
content = re.sub(
    r'<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border\s*border-white/20 rounded-full mb-8">[\s\S]*?</div>',
    '',
    content
)

# Remove the scroll indicator
content = re.sub(
    r'<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">[\s\S]*?</div>\s*</div>',
    '',
    content
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Removed both elements')
