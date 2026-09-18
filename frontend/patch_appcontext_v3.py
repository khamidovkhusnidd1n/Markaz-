import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\context\AppContext.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add to AppState interface
content = content.replace(
    "  backendError: string | null;\n",
    "  backendError: string | null;\n  departments: Department[];\n  pedagogues: Pedagogue[];\n  pedagogueProjects: PedagogueProject[];\n"
)

# 2. Add useState hooks
content = content.replace(
    "  const [internationalMedia, setInternationalMedia] = useState<InternationalMedia[]>([]);\n",
    "  const [internationalMedia, setInternationalMedia] = useState<InternationalMedia[]>([]);\n  const [departments, setDepartments] = useState<Department[]>([]);\n  const [pedagogues, setPedagogues] = useState<Pedagogue[]>([]);\n  const [pedagogueProjects, setPedagogueProjects] = useState<PedagogueProject[]>([]);\n"
)

# 3. Add to refreshData (getAllData resolution)
content = content.replace(
    "      setInternationalMedia(data.internationalMedia);\n",
    "      setInternationalMedia(data.internationalMedia);\n      setDepartments(data.departments || []);\n      setPedagogues(data.pedagogues || []);\n      setPedagogueProjects(data.pedagogueProjects || []);\n"
)

# 4. Add to Provider value
content = content.replace(
    "    internationalMedia,\n",
    "    internationalMedia,\n    departments,\n    pedagogues,\n    pedagogueProjects,\n"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("AppContext successfully patched with useState!")
