import re

with open('Backend/core/admin.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Patch AppealAdmin
content = re.sub(
    r"list_display = \['full_name', 'appeal_type_display', 'phone_link', 'email', \n?'created_at'\]",
    "list_display = ['full_name', 'appeal_type_display', 'status', 'phone_link', 'email', 'created_at']",
    content
)

content = re.sub(
    r"\('?? Murojaat matni', \{\n            'fields': \('appeal_type', 'description'\)\n        \}\),",
    "('Murojaat matni', {\n            'fields': ('appeal_type', 'description')\n        }),\n        ('Holat va Natija', {\n            'fields': ('status', 'admin_note')\n        }),",
    content
)

content = re.sub(
    r"def get_readonly_fields\(self, request, obj=None\):\n        return \[f.name for f in self.model._meta.fields\]\n\n    def has_add_permission\(self, request\):\n        return False",
    "def get_readonly_fields(self, request, obj=None):\n        return [f.name for f in self.model._meta.fields if f.name not in ['status', 'admin_note']]\n\n    def has_add_permission(self, request):\n        return False\n\n    def has_change_permission(self, request, obj=None):\n        return True",
    content
)

# Patch ApplicationAdmin
content = re.sub(
    r"list_display = \['full_name', 'application_type_display', 'direction', 'phone_link', \n?'created_at'\]",
    "list_display = ['full_name', 'application_type_display', 'direction', 'status', 'phone_link', 'created_at']",
    content
)

content = re.sub(
    r"\('?? Ariza tafsilotlari', \{\n            'fields': \('application_type', 'direction'\)\n        \}\),",
    "('Ariza tafsilotlari', {\n            'fields': ('application_type', 'direction')\n        }),\n        ('Holat va Natija', {\n            'fields': ('status', 'admin_note')\n        }),",
    content
)

with open('Backend/core/admin.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
