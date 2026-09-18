import os
import django
import urllib.request
import urllib.error
import time
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')
django.setup()

from core.models import Course

course_images = {
    8: "embroidery",
    9: "gold",
    10: "painting",
    11: "fashion",
    7: "painting",
    2: "fine-art",
    3: "pottery",
    4: "graphic",
    5: "design",
    6: "gallery",
    12: "sculpture",
    13: "museum"
}

for cid, keyword in course_images.items():
    try:
        c = Course.objects.get(id=cid)
        if c.photo and c.photo.name:
            # Skip if already downloaded successfully
            continue
            
        url = f"https://loremflickr.com/800/600/{keyword},art"
        
        # Try up to 3 times in case of 500 errors
        for attempt in range(3):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                response = urllib.request.urlopen(req)
                image_content = response.read()
                break
            except urllib.error.HTTPError as e:
                if attempt == 2:
                    raise e
                time.sleep(1)
        
        filename = f"course_{cid}_{keyword}.jpg"
        
        if c.photo:
            c.photo.delete(save=False)
            
        c.photo.save(filename, ContentFile(image_content))
        print(f"Successfully updated course {cid} with image: {keyword}")
        
    except Exception as e:
        print(f"Failed to update course {cid}: {e}")
