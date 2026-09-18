import re

def main():
    with open("Backend/core/models.py", "r", encoding="utf-8") as f:
        content = f.read()

    # Remove tasks, tasks_ru, tasks_en
    content = re.sub(r'    tasks = models\.TextField.*?tasks_en = models\.TextField.*?\n', '', content, flags=re.DOTALL)
    
    # Remove detail_image, detail_video_url
    content = re.sub(r'    detail_image = models\.ImageField.*?detail_video_url = models\.URLField.*?\n', '', content, flags=re.DOTALL)

    with open("Backend/core/models.py", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    main()
