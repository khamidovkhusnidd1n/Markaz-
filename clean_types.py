import re

def main():
    with open("frontend/types.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # Remove tasks fields
    content = re.sub(r'  tasks: string;\n  tasks_ru\?: string;\n  tasks_en\?: string;\n', '', content)
    
    # Remove detail media fields
    content = re.sub(r'  detail_image\?: string;\n  detail_video_url\?: string;\n', '', content)

    with open("frontend/types.ts", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    main()
