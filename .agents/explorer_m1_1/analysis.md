# Technical Investigation Report: PedagogueProject Multiple Image Upload in Django Admin

**Project:** SAYT  
**Milestone:** 1  
**Investigator:** Explorer 1 (`teamwork_preview_explorer`)  
**Target Directory:** `Backend/core/`  
**Date:** 2026-07-23  

---

## 1. Observation

Direct observations and evidence gathered from inspecting the `Backend/` codebase:

1. **Model Definitions (`Backend/core/models.py`)**:
   - `PedagogueProject` (lines 1043–1078): Defines project metadata (`pedagogue`, `title`, `description`, `views_count`, `votes_count`).
   - `PedagogueProjectImage` (lines 1081–1093): Defines related images (`project = models.ForeignKey(PedagogueProject, related_name='images')`, `image = models.ImageField(...)`).

2. **Admin Form and Widget Definitions (`Backend/core/admin.py`)**:
   - Lines 797–798:
     ```python
     class MultipleFileInput(forms.ClearableFileInput):
         allow_multiple_selected = True
     ```
   - Lines 800–809:
     ```python
     class PedagogueProjectForm(forms.ModelForm):
         images_upload = forms.FileField(
             widget=MultipleFileInput(attrs={'multiple': True}),
             required=False,
             label="Ko'plab rasmlarni bir vaqtda yuklash (Shu yerdan bir nechta rasmni tanlashingiz mumkin)"
         )

         class Meta:
             model = PedagogueProject
             fields = '__all__'
     ```
   - Lines 815–839 (`PedagogueProjectAdmin`):
     ```python
     @admin.register(PedagogueProject)
     class PedagogueProjectAdmin(admin.ModelAdmin):
         form = PedagogueProjectForm
         ...
         inlines = [PedagogueProjectImageInline]
         ...
         def save_model(self, request, obj, form, change):
             super().save_model(request, obj, form, change)
             
             # Handle multiple images upload
             if request.FILES:
                 for f in request.FILES.getlist('images_upload'):
                     PedagogueProjectImage.objects.create(project=obj, image=f)
     ```

3. **Erroneous Code Injection (`Backend/core/admin.py`)**:
   - Lines 523–529 (`AppContentAdmin`):
     ```python
     def save_model(self, request, obj, form, change):
         super().save_model(request, obj, form, change)
         
         # Handle multiple images upload
         if request.FILES:
             for f in request.FILES.getlist('images_upload'):
                 PedagogueProjectImage.objects.create(project=obj, image=f)
     ```
   - *Origin*: Found in `Backend/patch_pedagogue_project.py` (lines 42–57), where an automated script search-and-replaced the pattern `            )\n        }),\n    )\n\n`, unintentionally matching `AppContentAdmin` (lines 521–522) before reaching `PedagogueProjectAdmin`.

4. **Runtime Reproduction and Verification Command Output**:
   - Command executed:
     ```powershell
     python -c "from core.admin import PedagogueProjectForm; ..."
     ```
   - Results:
     - `MultipleFileInput.value_from_datadict` returned a `list` of `UploadedFile` objects: `[<SimpleUploadedFile: file1.jpg (image/jpeg)>, <SimpleUploadedFile: file2.jpg (image/jpeg)>]`.
     - `forms.FileField.clean(data)` raised the following exception and trace:
       ```
       Traceback (most recent call last):
         File "django/forms/fields.py", line 663, in to_python
           file_name = data.name
                       ^^^^^^^^^
       AttributeError: 'list' object has no attribute 'name'

       django.core.exceptions.ValidationError: ['Hech qanday fayl yuborilmadi. Formadagi kodlash turini tekshiring.']
       ```
     - Form validation output: `form.is_valid()` evaluated to `False` with error message `"Hech qanday fayl yuborilmadi. Formadagi kodlash turini tekshiring."` under `images_upload`.

---

## 2. Logic Chain

1. **Widget output vs Field expectation**:
   - Setting `allow_multiple_selected = True` on `forms.ClearableFileInput` causes `widget.value_from_datadict()` to call `files.getlist(name)`, which returns a Python `list` containing all uploaded files.
   - However, standard Django `forms.FileField` expects `data` to be a single `UploadedFile` instance (or `None`).

2. **Form validation failure**:
   - Inside `FileField.to_python(data)`, Django tries to read `data.name`.
   - Because `data` is a `list`, `AttributeError` is raised.
   - Django catches `AttributeError` and interprets it as an invalid file submission, raising `ValidationError("Hech qanday fayl yuborilmadi. Formadagi kodlash turini tekshiring.")`.

3. **Admin form processing lifecycle**:
   - In Django Admin, when a user submits a form in the admin interface, Django first executes `form.is_valid()`.
   - Because `images_upload` fails validation, `form.is_valid()` returns `False`.
   - Django Admin aborts the save process. It **never reaches** `save_model(request, obj, form, change)`.
   - As a result, no `PedagogueProjectImage` records are ever created from `images_upload`.

4. **Secondary Bug in `AppContentAdmin`**:
   - `AppContentAdmin` has `save_model()` containing `PedagogueProjectImage.objects.create(project=obj, image=f)`.
   - If an admin user saves `AppContent` while uploading files (e.g. `structure_image`), Django would pass an `AppContent` instance as `project`, resulting in a `ValueError` because `PedagogueProjectImage.project` expects a `PedagogueProject` instance.

---

## 3. Caveats

- **Existing Single Image Upload via Inlines**: The `PedagogueProjectImageInline` (`TabularInline`) functionality works fine for uploading single images one row at a time. The failure is strictly isolated to the bulk `images_upload` multi-file field on `PedagogueProjectForm`.
- **Read-Only Scope**: In accordance with explorer agent permissions, no changes were made to source files in `Backend/core/`.

---

## 4. Conclusion & Recommended Step-by-Step Fix

### Root Cause Conclusion
Multiple image upload fails because `PedagogueProjectForm.images_upload` uses standard `forms.FileField` with `MultipleFileInput(allow_multiple_selected=True)`. `FileField.to_python()` throws an `AttributeError` when given a `list` of files, producing a `ValidationError` that prevents `form.is_valid()` from passing and blocks `save_model()` from executing.

### Step-by-Step Implementation Recommendations for Implementer

#### Step 1: Create a custom `MultipleFileField` in `Backend/core/admin.py`
Replace standard `forms.FileField` on `images_upload` with a custom `MultipleFileField` subclass that properly iterates over a list of uploaded files during `clean()`:

```python
class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('widget', MultipleFileInput(attrs={'multiple': True}))
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data if d]
        else:
            cleaned = single_file_clean(data, initial)
            result = [cleaned] if cleaned else []
        return result
```

#### Step 2: Update `PedagogueProjectForm` in `Backend/core/admin.py`
Use `MultipleFileField` for `images_upload`:

```python
class PedagogueProjectForm(forms.ModelForm):
    images_upload = MultipleFileField(
        required=False,
        label="Ko'plab rasmlarni bir vaqtda yuklash (Shu yerdan bir nechta rasmni tanlashingiz mumkin)"
    )

    class Meta:
        model = PedagogueProject
        fields = '__all__'
```

#### Step 3: Update `PedagogueProjectAdmin.save_model` in `Backend/core/admin.py`
Safely process cleaned files from `form.cleaned_data`:

```python
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        # Save bulk uploaded images
        images = form.cleaned_data.get('images_upload') or []
        for f in images:
            PedagogueProjectImage.objects.create(project=obj, image=f)
```

#### Step 4: Remove stray `save_model` from `AppContentAdmin` in `Backend/core/admin.py`
Remove lines 523–529 from `AppContentAdmin`:

```python
# REMOVE THIS BLOCK FROM AppContentAdmin:
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        # Handle multiple images upload
        if request.FILES:
            for f in request.FILES.getlist('images_upload'):
                PedagogueProjectImage.objects.create(project=obj, image=f)
```

---

## 5. Verification Method

To verify the proposed fix independently:

1. **Automated Python Test Verification**:
   Run the following command from `Backend/` directory:
   ```powershell
   python -c "
   import os, django
   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')
   django.setup()

   from core.admin import PedagogueProjectForm
   from core.models import Pedagogue
   from django.utils.datastructures import MultiValueDict
   from django.core.files.uploadedfile import SimpleUploadedFile

   f1 = SimpleUploadedFile('test1.jpg', b'content1', content_type='image/jpeg')
   f2 = SimpleUploadedFile('test2.jpg', b'content2', content_type='image/jpeg')
   p = Pedagogue.objects.first()

   files = MultiValueDict({'images_upload': [f1, f2]})
   data = {'title': 'Verification Project', 'pedagogue': p.pk, 'views_count': 0, 'votes_count': 0}

   form = PedagogueProjectForm(data=data, files=files)
   assert form.is_valid(), f'Form validation failed: {form.errors}'
   print('VERIFICATION SUCCESSFUL: Form is valid, cleaned_data contains', len(form.cleaned_data['images_upload']), 'files.')
   "
   ```
   *Expected output*: `VERIFICATION SUCCESSFUL: Form is valid, cleaned_data contains 2 files.`

2. **Manual Django Admin UI Verification**:
   - Log into Django Admin (`/admin/core/pedagogueproject/add/`).
   - Fill in title and pedagogue.
   - In "Ko'plab rasmlarni bir vaqtda yuklash", select multiple `.jpg` or `.png` files using Ctrl/Shift + click.
   - Click **Save**.
   - Verify that form saves without error and the uploaded images appear in the `PedagogueProjectImage` inline section / project detail view.
