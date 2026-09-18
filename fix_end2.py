with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '        </div>\n      </div>\n      <ImageModal',
    '          </div>\n        </div>\n      </div>\n      </div>\n      <ImageModal'
)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

with open("frontend/pages/Departments.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '              </div>\n            </div>\n          )}\n        </>',
    '                </div>\n              </div>\n            </div>\n            </div>\n          )}\n        </>'
)

with open("frontend/pages/Departments.tsx", "w", encoding="utf-8") as f:
    f.write(content)
