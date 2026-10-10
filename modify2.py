import re

with open('frontend/components/Layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to inject the desktop button right before desktop-nav-lang-container
pattern = r'(<div className="desktop-nav-lang-container.*?>)'
button_html = '''
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <button 
                  onClick={() => setIsUsefulLinksOpen(true)}
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-[12px] md:text-[13px] font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2 group mr-1"
                >
                  <LayoutGrid size={15} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="relative z-10 whitespace-nowrap">{t('layout.useful_links', "Foydali havolalar")}</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
                
                \\1
'''
# Wait, if we wrap the whole thing in a parent div `flex items-center gap-1 ml-2 shrink-0`, we must also close it.
# Let's replace the whole nav block instead!
nav_pattern = r'(<nav className="hidden 2xl:flex items-center gap-1 min-w-0">.*?<div className="desktop-nav-lang-container.*?)(<LangButton lang="uz" label="UZB" />.*?</nav>)'
# Actually, the easiest is to just use re.sub on the desktop-nav-lang-container line
old_block = r'(<div className="desktop-nav-lang-container flex items-center gap-1 ml-2 border-l pl-2 border-gray-200 shrink-0">)'

new_block = '''<div className="flex items-center gap-1 ml-2 shrink-0">
                <button 
                  onClick={() => setIsUsefulLinksOpen(true)}
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-[12px] md:text-[13px] font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2 group mr-1"
                >
                  <LayoutGrid size={15} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="relative z-10 whitespace-nowrap">{t('layout.useful_links', "Foydali havolalar")}</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
                
                <div className="desktop-nav-lang-container flex items-center gap-1 border-l pl-2 border-gray-200">'''

# Let's replace the old_block AND we need to add the closing </div> before </nav>
# Let's write a script to replace the entire <nav>...</nav> segment precisely.
