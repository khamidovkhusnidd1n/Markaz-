import re
with open("frontend/pages/Departments.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "const [zoomedImage" not in content:
    content = content.replace("const [activeTab, setActiveTab] = React.useState(0);",
                              "const [activeTab, setActiveTab] = React.useState(0);\n  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null);")
    with open("frontend/pages/Departments.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed Departments.tsx")
