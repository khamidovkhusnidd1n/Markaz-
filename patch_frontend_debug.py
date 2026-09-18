import os

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace condition with a permanent visible block
content = content.replace(
    "{dept.department_posts && dept.department_posts.length > 0 && (",
    "{true && (\n        <div style={{ backgroundColor: 'red', padding: '20px', color: 'white', fontWeight: 'bold' }}>DEBUG: POSTS = {JSON.stringify(dept.department_posts || 'UNDEFINED')}</div>\n"
)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Debug added")
