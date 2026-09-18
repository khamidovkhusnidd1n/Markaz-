import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE','markaz_backend.settings')
django.setup()
from core.models import Personnel

p = Personnel.objects.filter(full_name__icontains='rayeva').first()
if p:
    p.position_en = 'Legal Counsel'
    p.position_ru = 'Юрисконсульт'
    p.duties_en = """<ul><li>Providing legal advice on issues related to the Center's activities.</li><li>Reviewing contracts, orders, and other documents for compliance with legislation.</li><li>Legally protecting the Center's interests and participating in the preparation of legal documents.</li><li>Studying changes in current legislation and explaining them to employees.</li></ul>"""
    p.duties_ru = """<ul><li>Предоставление юридических консультаций по вопросам, связанным с деятельностью Центра.</li><li>Проверка договоров, приказов и других документов на соответствие законодательству.</li><li>Юридическая защита интересов Центра и участие в подготовке юридических документов.</li><li>Изучение изменений в действующем законодательстве и их разъяснение сотрудникам.</li></ul>"""
    p.save()
    print('Updated:', p.full_name)
