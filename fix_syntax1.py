with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '</div>\n\n                    {/* Media Right Column */}',
    '</div>\n                      )}\n                    </div>\n\n                    {/* Media Right Column */}'
)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
