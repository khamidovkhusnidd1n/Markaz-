# Milestone 3 Empirical Challenge Report: Image Upload Functionality

**Agent**: Challenger 1 (`teamwork_preview_challenger`)  
**Date**: 2026-07-23  
**Working Directory**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\challenger_m3_1`  
**Project Root**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT`  
**Test Harness File**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\tests_empirical_m3.py`  

---

## Challenge Summary

**Overall Risk Assessment**: **MEDIUM**

While core image upload and multi-image linking mechanisms function correctly, an empirical vulnerability was discovered in `PedagogueProjectForm` where non-image files bypass form validation due to the use of generic `FileField` rather than `ImageField` validation.

---

## Empirical Verification & Test Results

### 1. Combined Test Suite Execution (`core.tests_milestone2` + `core.tests_empirical_m3`)
- **Command**: `python manage.py test core.tests_milestone2 core.tests_empirical_m3`
- **Result**: `OK` (14/14 tests passed)
- **Execution Time**: 80.144 seconds
- **Pass Breakdown**:
  - `core.tests_milestone2` (4 tests): All passed (`test_pedagogue_project_multi_image_upload_form`, `test_pedagogue_project_admin_save_model`, `test_news_viewset_has_relocated_actions`, `test_static_admin_authentication_security`).
  - `core.tests_empirical_m3` (10 tests): All passed.

### 2. Detailed Empirical Test Scenarios
  1. `test_pedagogue_project_form_multiple_images`: Form valid with 3 files (`.jpg`, `.png`).
  2. `test_pedagogue_project_admin_save_model_multiple_images`: Admin `save_model` successfully creates 3 `PedagogueProjectImage` DB records linked to `PedagogueProject`.
  3. `test_pedagogue_project_admin_save_model_nested_list_and_empty`: Handled empty upload list and nested querydict lists gracefully.
  4. `test_pedagogue_project_incremental_image_uploads`: Incrementally appending images on existing project updates preserves existing linked images and adds new ones.
  5. `test_course_image_create_update_delete`: `Course.photo` upload, updating photo to new image, updating non-photo fields, and clearing photo (`None`) function properly.
  6. `test_news_and_news_image_relationships`: `News` inline `NewsImage` creation, order re-assignment, image replacement, and deletion update DB count accurately.
  7. `test_gallery_item_and_gallery_image_handling`: `GalleryItem` cover image updates and `GalleryImage` inline creation handle distinct files without corruption.
  8. `test_teacher_photo_upload_update_and_translation_side_effects`: `Teacher.photo` upload, update, and save operations work alongside translation hooks.
  9. `test_filenames_with_special_characters_and_cyrillic`: `generate_unique_filename` safely extracts file extension and generates UUID hex string, preventing filesystem encoding/path sanitization issues.
  10. `test_pedagogue_project_non_image_file_vulnerability`: Empirical confirmation that `MultipleFileField` passes form validation for `.txt` files and creates `PedagogueProjectImage` records with non-image files.

---

## Challenges & Failure Modes Found

### [Medium] Challenge 1: Non-Image File Validation Deficit in `PedagogueProjectForm`
- **Assumption Challenged**: `PedagogueProjectForm.images_upload` only accepts valid image files.
- **Attack Scenario**: An admin or user submits a `.txt`, `.php`, `.sh`, or `.exe` file via `PedagogueProjectForm.images_upload`.
- **Empirical Proof**: `MultipleFileField` inherits directly from `forms.FileField` without calling `forms.ImageField` validation or checking image mime/header byte signatures. When supplied with valid model data and a `.txt` file, `form.is_valid()` returns `True`, and `PedagogueProjectAdmin.save_model` creates `PedagogueProjectImage` records storing non-image files under `uploads/pedagogueprojectimage/`.
- **Blast Radius**: Arbitrary file uploads stored in media directory; potential server execution if media directory permits execution or user bandwidth/storage exhaustion.
- **Mitigation**: Update `MultipleFileField` in `Backend/core/admin.py` to validate each item using `forms.ImageField().clean(item)` or check file extensions and Pillow image headers before returning cleaned data.

### [Low] Challenge 2: Network Latency Penalty on Model Save (Translation Hooks)
- **Assumption Challenged**: Saving models in offline or restricted-network environments executes instantaneously.
- **Attack Scenario**: In `models.py`, `save()` methods on `News`, `Teacher`, `Course`, `Department`, `Pedagogue`, and `PedagogueProject` attempt network calls to Google Translate via `deep_translator`.
- **Empirical Proof**: When running test suites, network connections fail/timeout. Although caught by `try...except Exception`, each save call delays response times by ~1-3 seconds, causing a 14-test suite to take over 80 seconds to complete.
- **Mitigation**: Mock translation service calls in unit test suite or disable automated network translation during test runs / when offline.

---

## Stress Test Matrix

| Scenario | Expected Behavior | Actual Behavior | Pass/Fail |
|---|---|---|---|
| Multi-image submit (3 images) | 3 `PedagogueProjectImage` objects created | 3 `PedagogueProjectImage` objects created | PASS |
| Incremental image upload | New images appended, old preserved | New images appended, old preserved | PASS |
| `Course` image replace/clear | Photo updated / set to NULL | Photo updated / set to NULL | PASS |
| `NewsImage` inline re-order/delete | Inline order updated, DB count decreases | Inline order updated, DB count decreases | PASS |
| `GalleryItem` cover update | `cover_image` filename updated | `cover_image` filename updated | PASS |
| Special char / Cyrillic filename | Hex UUID generated with original extension | Hex UUID generated with original extension | PASS |
| Non-image file upload (.txt) | Rejected by form validation | Accepted & stored in DB (`MultipleFileField` FileField flaw) | FAIL (Adversarial Bug) |

---

## Unchallenged Areas

- Frontend image cropping and canvas preview (out of scope for Backend python unit test harness).
