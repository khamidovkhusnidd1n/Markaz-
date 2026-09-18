import re

def main():
    with open("Backend/core/models.py", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    out = []
    i = 0
    in_try = False
    skip_mode = False
    fields_list = "[]"
    
    replacement = """            try:
                import urllib.request
                import urllib.parse
                import json
                import re

                def strip_html(text):
                    if not text: return ""
                    return re.sub(r'<[^>]+>', ' ', text).strip()

                def translate_text(text, target):
                    plain = strip_html(text)
                    if not plain:
                        return ''
                    try:
                        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl={target}&dt=t&q=" + urllib.parse.quote(plain)
                        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                        res = urllib.request.urlopen(req, timeout=5)
                        data = json.loads(res.read())
                        return "".join([d[0] for d in data[0] if d[0]])
                    except Exception as e:
                        print("Direct translation error:", e)
                        return ''

                fields = %FIELDS%
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
"""

    while i < len(lines):
        line = lines[i]
        
        # If we see 'from deep_translator import GoogleTranslator', 
        # it means the previous line was 'try:' (usually).
        if "from deep_translator import GoogleTranslator" in line:
            # Look ahead to find 'fields = [...]'
            j = i
            while j < i + 10:
                if "fields =" in lines[j] and "[" in lines[j]:
                    fields_list = lines[j].split("fields = ")[1].strip()
                    break
                j += 1
            
            # Now we pop the last 'try:' we outputted
            if out and "try:" in out[-1]:
                out.pop()
                
            out.append(replacement.replace("%FIELDS%", fields_list))
            
            # Skip until 'except Exception'
            while i < len(lines) and "except Exception" not in lines[i]:
                i += 1
                
            # Now i is at 'except Exception as e:'
            out.append(lines[i])
            i += 1
            continue
            
        out.append(line)
        i += 1
        
    new_content = "".join(out)
    
    # Also fix Department checks
    new_content = new_content.replace(
        "not getattr(self, 'tasks_ru', '') or not getattr(self, 'tasks_en', '') or \\\n           ",
        ""
    )
    new_content = new_content.replace(
        "fields = ['name', 'description', 'tasks', 'detail_text']",
        "fields = ['name', 'description', 'detail_text']"
    )
    
    with open("Backend/core/models.py", "w", encoding="utf-8") as f:
        f.write(new_content)

if __name__ == "__main__":
    main()
