import os
import re

files_to_patch = [
    "c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/ScientificPotential.tsx",
    "c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
    "c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Departments.tsx",
    "c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Teachers.tsx",
]

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the ImageModal usage and replace it
    content = re.sub(r'<ImageModal\s*imageUrl=\{zoomedImage \|\| \'\'\}\s*isOpen=\{!!zoomedImage\}\s*onClose=\{.*?\}\s*/>',
                     r'<ImageModal \n        images={zoomedImage ? [zoomedImage] : []}\n        initialIndex={0}\n        isOpen={!!zoomedImage}\n        onClose={() => setZoomedImage(null)}\n      />',
                     content, flags=re.DOTALL)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated profiles")
