import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')
django.setup()

from core.models import DepartmentTask, Department
dept = Department.objects.first()
t = DepartmentTask(department=dept, title="O'quv jarayonini monitoring qilish", task_text="Qayta tayyorlash va malaka oshirish kurslarining belgilangan reja va dasturlar asosida olib borilishini nazorat qilish.")
t.save()
print("Saved ID:", t.id)
print("RU Title:", repr(t.title_ru))
print("EN Title:", repr(t.title_en))
print("RU Text:", repr(t.task_text_ru))
print("EN Text:", repr(t.task_text_en))
