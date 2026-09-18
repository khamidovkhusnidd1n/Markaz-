import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\context\AppContext.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
imports_pattern = r'Teacher,\n} from \'../types\';'
imports_replacement = r'Teacher,\n  Department,\n  Pedagogue,\n  PedagogueProject,\n} from \'../types\';'
content = re.sub(imports_pattern, imports_replacement, content)

# Add to AppState interface
state_pattern = r'  internationalProjects: InternationalProject\[\];\n  internationalMedia: InternationalMedia\[\];\n}'
state_replacement = r"""  internationalProjects: InternationalProject[];
  internationalMedia: InternationalMedia[];
  departments: Department[];
  pedagogues: Pedagogue[];
  pedagogueProjects: PedagogueProject[];
}"""
content = re.sub(state_pattern, state_replacement, content)

# Add to initial state
initial_state_pattern = r'  internationalProjects: \[\],\n  internationalMedia: \[\],\n}'
initial_state_replacement = r"""  internationalProjects: [],
  internationalMedia: [],
  departments: [],
  pedagogues: [],
  pedagogueProjects: [],
}"""
content = re.sub(initial_state_pattern, initial_state_replacement, content)

# Add to provider values
provider_pattern = r'    internationalProjects: state.internationalProjects,\n    internationalMedia: state.internationalMedia,\n'
provider_replacement = r"""    internationalProjects: state.internationalProjects,
    internationalMedia: state.internationalMedia,
    departments: state.departments,
    pedagogues: state.pedagogues,
    pedagogueProjects: state.pedagogueProjects,
"""
content = re.sub(provider_pattern, provider_replacement, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("AppContext patched.")
