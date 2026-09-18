import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE','markaz_backend.settings')
django.setup()
from core.models import Course

updates = {
  8: "Ushbu qayta tayyorlash kursi tinglovchilarda an'anaviy va zamonaviy kashtachilik texnikalari, kompozitsiya asoslari va badiiy bezak yaratish bo'yicha kasbiy hamda amaliy ko'nikmalarni shakllantirishga qaratilgan.",
  9: "Ushbu qayta tayyorlash kursi milliy zardo'zlik san'ati an'analarini o'rganish, zardo'zlik buyumlarini loyihalash va amaliy tayyorlash texnologiyalarini chuqur o'zlashtirishga qaratilgan.",
  10: "Ushbu qayta tayyorlash kursi dastgohli rangtasvirning nazariy asoslari, moybo'yoq texnikasi, janrlar xilma-xilligi va professional ijodiy asarlar yaratish ko'nikmalarini rivojlantirishni nazarda tutadi.",
  11: "Ushbu qayta tayyorlash kursi zamonaviy va milliy liboslar dizayni, bichish-tikish texnologiyalari, moda tendensiyalari hamda individual badiiy uslub yaratish bo'yicha kasbiy mahoratni shakllantirishga qaratilgan.",
  7: "Ushbu qayta tayyorlash kursi rangtasvirning asosiy turlari bo'yicha chuqurlashtirilgan nazariy va amaliy bilimlar berish, ilg'or ijodiy uslublarni o'zlashtirish va professional rassomlik mahoratini takomillashtirishga qaratilgan."
}

for cid, desc in updates.items():
    c = Course.objects.get(id=cid)
    c.description = desc
    c.save()
