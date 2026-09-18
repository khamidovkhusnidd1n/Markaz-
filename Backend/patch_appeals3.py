with open('Backend/core/admin.py', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Fix ApplicationAdmin fieldsets
content = re.sub(
    r"\('.. Ariza tafsilotlari', \{\n            'fields': \('application_type', 'direction'\)\n        \}\),",
    "('Ariza tafsilotlari', {\n            'fields': ('application_type', 'direction')\n        }),\n        ('Holat va Natija', {\n            'fields': ('status', 'admin_note')\n        }),",
    content
)

with open('Backend/core/admin.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
