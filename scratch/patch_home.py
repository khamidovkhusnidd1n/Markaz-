import re

with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Home.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add NewsModal import
if "import { NewsModal }" not in content:
    content = content.replace("import { Link, useLocation } from 'react-router-dom';", 
                              "import { Link, useLocation } from 'react-router-dom';\nimport { NewsModal } from '../components/NewsModal';")
    # also add NewsItem to types if not there
    if "import { NewsItem" not in content and "import { AppContent" in content:
        content = content.replace("import { AppContent", "import { AppContent, NewsItem")

# Add state
if "const [selectedNews, setSelectedNews]" not in content:
    content = content.replace("const [heroIndex, setHeroIndex] = useState(0);",
                              "const [heroIndex, setHeroIndex] = useState(0);\n  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);")

# Replace Links with Buttons for News Items
# 1. Main featured card
content = re.sub(r'<Link\s+to={`/news/\$\{mainItem\.id\}`}(.*?)className="(.*?)"(.*?)>', 
                 r'<button onClick={() => setSelectedNews(mainItem)}\1 className="\2 text-left w-full block"\3>', 
                 content, flags=re.DOTALL)
# 2. Secondary item card
content = re.sub(r'<Link\s+to={`/news/\$\{secondaryItem\.id\}`}(.*?)className="(.*?)"(.*?)>', 
                 r'<button onClick={() => setSelectedNews(secondaryItem)}\1 className="\2 text-left w-full block"\3>', 
                 content, flags=re.DOTALL)
# 3. Small cards
content = re.sub(r'<Link\s+to={`/news/\$\{item\.id\}`}(.*?)className="(.*?)"(.*?)>', 
                 r'<button onClick={() => setSelectedNews(item)}\1 className="\2 text-left w-full block"\3>', 
                 content, flags=re.DOTALL)

# Replace closing </Link> for these specific items with </button>
# Instead of complex regex, we can just find them and replace. The tricky part is not replacing the "Barcha yangiliklar" Link.
# The "Barcha yangiliklar" Link is `<Link to="/news"`.
# So we can just replace ALL `</Link>` that come before the "Barcha yangiliklar" link, OR we just do it manually.
# Let's replace the opening tag to <button, so we MUST replace the closing tag to </button>.
# Using regex to match the whole block is safer:

def replace_link_to_button(text):
    # This is a bit risky. Let's just do targeted replacements in the known text block.
    # We will split the file by `<section ref={newsReveal.ref}`
    parts = text.split("ref={newsReveal.ref}")
    if len(parts) == 2:
        news_section = parts[1]
        
        # Replace the item Links with Buttons
        news_section = re.sub(r'<Link\s+to={`/news/\$\{[^}]+\}`}.*?>', lambda m: m.group(0).replace('<Link', '<button').replace('to=', 'data-to=').replace('className="', 'className="text-left w-full block '), news_section)
        # But we still need to add onClick. 
        news_section = news_section.replace('data-to={`/news/${mainItem.id}`}', 'onClick={() => setSelectedNews(mainItem)}')
        news_section = news_section.replace('data-to={`/news/${secondaryItem.id}`}', 'onClick={() => setSelectedNews(secondaryItem)}')
        news_section = news_section.replace('data-to={`/news/${item.id}`}', 'onClick={() => setSelectedNews(item)}')
        
        # Now replace all </Link> inside the news items. 
        # Note: the "Barcha yangiliklar" link is <Link to="/news" ... > </Link>.
        # We can replace </Link> by checking if the corresponding open tag was changed.
        # Simple way: just replace </Link> with </button> if it's before the `<Link to="/news"` 
        
        subparts = news_section.split('<Link\n                  to="/news"')
        if len(subparts) == 2:
            subparts[0] = subparts[0].replace('</Link>', '</button>')
            news_section = '<Link\n                  to="/news"'.join(subparts)
            
            # Add Modal at the end of the section
            news_section = news_section.replace('</section>', '{selectedNews && <NewsModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />}\n        </section>')
            
            return parts[0] + "ref={newsReveal.ref}" + news_section
    return text

new_content = replace_link_to_button(content)

with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Home.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated Home.tsx")
