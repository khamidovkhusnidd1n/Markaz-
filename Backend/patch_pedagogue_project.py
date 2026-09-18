import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\admin.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

form_code = """
class PedagogueProjectForm(forms.ModelForm):
    images_upload = forms.FileField(
        widget=forms.ClearableFileInput(attrs={'multiple': True}),
        required=False,
        label="Ko'plab rasmlarni bir vaqtda yuklash (Shu yerdan bir nechta rasmni tanlashingiz mumkin)"
    )

    class Meta:
        model = PedagogueProject
        fields = '__all__'
"""

# Insert form before PedagogueProjectImageInline
if "class PedagogueProjectForm" not in content:
    content = content.replace(
        "class PedagogueProjectImageInline(admin.TabularInline):",
        form_code + "\nclass PedagogueProjectImageInline(admin.TabularInline):"
    )

# Update PedagogueProjectAdmin
admin_update_pattern = r"class PedagogueProjectAdmin\(admin\.ModelAdmin\):\n    list_display = \['title', 'pedagogue', 'views_count', 'votes_count'\]"
admin_update_replacement = """class PedagogueProjectAdmin(admin.ModelAdmin):
    form = PedagogueProjectForm
    list_display = ['title', 'pedagogue', 'views_count', 'votes_count']"""
content = re.sub(admin_update_pattern, admin_update_replacement, content)

fieldset_pattern = r"                'views_count', 'votes_count'\n            \)\n        \}\),"
fieldset_replacement = """                'views_count', 'votes_count',
                'images_upload'
            )
        }),"""
content = re.sub(fieldset_pattern, fieldset_replacement, content)

# Add save_model method
save_model_code = """

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        # Handle multiple images upload
        if request.FILES:
            for f in request.FILES.getlist('images_upload'):
                PedagogueProjectImage.objects.create(project=obj, image=f)"""

# Insert save_model before the end of the class
if "def save_model(self, request, obj, form, change):" not in content:
    content = content.replace(
        "            )\n        }),\n    )\n\n",
        "            )\n        }),\n    )" + save_model_code + "\n\n"
    )

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("admin.py successfully patched with multiple image upload.")
