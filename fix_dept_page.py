import re
with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("const [currentImgIdx, setCurrentImgIdx] = React.useState<number>(0);",
                          "const [currentImgIdx, setCurrentImgIdx] = React.useState<number>(0);\n  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null);")

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed DepartmentPage.tsx")
