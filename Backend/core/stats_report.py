import json
import os
from django.conf import settings

DEFAULT_STATS_REPORT = {
    # Sarlavhalar va matnlar (to'liq Admin paneldan o'zgartiriladi)
    "section_badge": "KO'RSATKICHLAR VA HISOBOT",
    "section_title": "Markaz faoliyati statistikasi",

    "card1_badge": "O'quv faoliyati",
    "card1_title": "Qayta tayyorlash va malaka oshirish faoliyati",
    "card1_summary": (
        "Mazkur markazda faoliyat davrida O'zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar "
        "vazirligining 284 nafar, Madaniyat vazirligining 740 nafar, Badiiy akademiya tasarrufidagi "
        "ta'lim muassasalaridan 578 nafar, kasbni rivojlantirishga yo'naltirilgan qisqa kurslarda "
        "141 nafar, jami 1743 nafar pedagog va mutaxassis kadrlar malaka oshirishdi hamda 389 nafar "
        "pedagog kadrlar qayta tayyorlovdan o'tkazildi."
    ),

    "mo_total_label": "Jami malaka oshirganlar",
    "mo_total": 1743,
    "mo_higher_edu_label": "Oliy ta'lim muassasalaridan",
    "mo_higher_edu": 284,
    "mo_culture_ministry_label": "O'zbekiston Respublikasi Madaniyat vazirligi tasarrufidagi ta'lim muassasalaridan",
    "mo_culture_ministry": 740,
    "mo_art_academy_label": "O'zbekiston Badiiy akademiyasi tasarrufidagi ta'lim muassasalaridan",
    "mo_art_academy": 578,
    "mo_short_courses_label": "Qisqa malaka oshirish kurslarida",
    "mo_short_courses": 141,

    "qt_total_label": "Jami qayta tayyorlash kurslarida",
    "qt_total": 389,
    "qt_painting_label": "Rangtasvir (turlari bo'yicha)",
    "qt_painting": 0,
    "qt_embroidery_label": "Badiiy kashtachilik usta-rassomi",
    "qt_embroidery": 0,
    "qt_gold_embroidery_label": "Badiiy zardo'zlik usta-rassomi",
    "qt_gold_embroidery": 0,

    # Xalqaro hamkorlik bo'limi
    "card2_badge": "Xalqaro aloqalar",
    "card2_title": "Xalqaro hamkorlik va xalqaro loyihalar",
    "card2_summary": (
        "Bugungi kunda Markaz tomonidan 10 ta xorijiy (Italiya, Xitoy, Gruziya, Belarus, Turkiya, "
        "Rossiya, Hindiston, Qozog'iston, Koreya, Ozarbayjon) mamlakatlarning 15 ta badiiy ta'limga "
        "ixtisoslashgan muassasalari bilan memorandumlar imzolandi va hamkorlik aloqalari yo'lga qo'yildi."
    ),
    "intl_countries_label": "Xorijiy mamlakatlar",
    "intl_countries_count": 10,
    "intl_countries_list": "Italiya\nXitoy\nGruziya\nBelarus\nTurkiya\nRossiya\nHindiston\nQozog'iston\nKoreya\nOzarbayjon",

    "intl_organizations_label": "Hamkor xorijiy tashkilotlar",
    "intl_organizations_count": 0,
    "intl_organizations_summary": "",
    "intl_organizations_list": "",

    "intl_projects_label": "Xalqaro ilmiy-ijodiy loyihalar",
    "intl_projects_count": 0,
    "intl_projects_list": "",
}


def get_report_file_path():
    media_root = getattr(settings, 'MEDIA_ROOT', None)
    if media_root:
        os.makedirs(media_root, exist_ok=True)
        return os.path.join(media_root, 'statistics_report.json')
    return os.path.join(settings.BASE_DIR, 'statistics_report.json')


def get_stats_report():
    data = DEFAULT_STATS_REPORT.copy()
    path = get_report_file_path()
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                saved = json.load(f)
                if isinstance(saved, dict):
                    data.update(saved)
        except Exception:
            pass
    return data


def save_stats_report(new_data):
    data = get_stats_report()
    for key in DEFAULT_STATS_REPORT.keys():
        if key in new_data and new_data[key] is not None:
            data[key] = new_data[key]
    path = get_report_file_path()
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
    return data
