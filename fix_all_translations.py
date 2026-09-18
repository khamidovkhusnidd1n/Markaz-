import re

def main():
    with open("Backend/core/models.py", "r", encoding="utf-8") as f:
        content = f.read()
        
    replacement = """
            try:
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

                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
"""

    pattern = re.compile(
        r"            try:\n"
        r"                from deep_translator import GoogleTranslator\n"
        r"                tr_ru = GoogleTranslator\(source='uz', target='ru'\)\n"
        r"                tr_en = GoogleTranslator\(source='uz', target='en'\)\n"
        r"                \n"
        r"                fields = (.*?)\n"
        r"                for f in fields:\n"
        r"                    if getattr\(self, f, ''\) and not getattr\(self, f'\{f\}_ru', ''\):\n"
        r"                        setattr\(self, f'\{f\}_ru', tr_ru\.translate\(getattr\(self, f\)\) or ''\)\n"
        r"                    if getattr\(self, f, ''\) and not getattr\(self, f'\{f\}_en', ''\):\n"
        r"                        setattr\(self, f'\{f\}_en', tr_en\.translate\(getattr\(self, f\)\) or ''\)",
        re.DOTALL
    )

    def repl(m):
        fields_def = m.group(1)
        res = replacement.replace("for f in fields:", f"fields = {fields_def}\n                for f in fields:")
        return res[1:] # strip leading newline

    new_content = pattern.sub(repl, content)

    # Also, remove 'tasks' from Department save fields and conditions since we deleted it
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
