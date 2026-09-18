import os

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add a giant red box at the top of the department content
giant_box = """
        <div style={{ backgroundColor: 'red', padding: '40px', margin: '40px 0', color: 'white', fontSize: '30px', fontWeight: 'bold', textAlign: 'center', borderRadius: '10px' }}>
          TEST: QILINGAN ISHLAR YUKLANDI! (POSTLAR SONI: {dept.department_posts ? dept.department_posts.length : 'YOQ'})
        </div>
"""

if "TEST: QILINGAN ISHLAR YUKLANDI" not in content:
    content = content.replace(
        '<div className="container mx-auto px-4 py-12">',
        '<div className="container mx-auto px-4 py-12">' + giant_box
    )

    with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Giant box added")
