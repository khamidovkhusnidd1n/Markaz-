import os

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Revert debug patch
content = content.replace(
    "{true && (\n        <div style={{ backgroundColor: 'red', padding: '20px', color: 'white', fontWeight: 'bold' }}>DEBUG: POSTS = {JSON.stringify(dept.department_posts || 'UNDEFINED')}</div>\n",
    "{dept.department_posts && dept.department_posts.length > 0 && (\n"
)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Debug removed")
