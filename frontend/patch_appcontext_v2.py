import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\context\AppContext.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add to AppState
content = re.sub(
    r"  backendError: string \| null;\n}",
    r"  backendError: string | null;\n  departments: Department[];\n  pedagogues: Pedagogue[];\n  pedagogueProjects: PedagogueProject[];\n}",
    content
)

# 2. Add to initialState
content = re.sub(
    r"  backendError: null,\n};",
    r"  backendError: null,\n  departments: [],\n  pedagogues: [],\n  pedagogueProjects: [],\n};",
    content
)

# 3. Add to context provider value
content = re.sub(
    r"    loading: state\.loading,\n    backendError: state\.backendError,\n  };",
    r"    loading: state.loading,\n    backendError: state.backendError,\n    departments: state.departments,\n    pedagogues: state.pedagogues,\n    pedagogueProjects: state.pedagogueProjects,\n  };",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("AppContext properly patched.")
