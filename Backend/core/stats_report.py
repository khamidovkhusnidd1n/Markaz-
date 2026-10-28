import json
import os
import re
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


def compute_auto_totals(data):
    """Automatically compute totals from sub-items and lists."""
    def to_int(val):
        try:
            return int(val or 0)
        except (ValueError, TypeError):
            return 0

    mo_sum = (
        to_int(data.get("mo_higher_edu"))
        + to_int(data.get("mo_culture_ministry"))
        + to_int(data.get("mo_art_academy"))
        + to_int(data.get("mo_short_courses"))
    )
    if mo_sum > 0:
        data["mo_total"] = mo_sum

    qt_sum = (
        to_int(data.get("qt_painting"))
        + to_int(data.get("qt_embroidery"))
        + to_int(data.get("qt_gold_embroidery"))
    )
    if qt_sum > 0:
        data["qt_total"] = qt_sum

    countries_raw = str(data.get("intl_countries_list") or "")
    countries_list = [s.strip() for s in re.split(r"[\n,;]+", countries_raw) if s.strip()]
    data["intl_countries_count"] = len(countries_list)

    orgs_raw = str(data.get("intl_organizations_list") or "")
    orgs_list = [s.strip() for s in re.split(r"\n+", orgs_raw) if s.strip()]
    data["intl_organizations_count"] = len(orgs_list)

    projs_raw = str(data.get("intl_projects_list") or "")
    projs_list = [s.strip() for s in re.split(r"\n+", projs_raw) if s.strip()]
    data["intl_projects_count"] = len(projs_list)

    return data


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
    return compute_auto_totals(data)


def save_stats_report(new_data):
    data = get_stats_report()
    for key in DEFAULT_STATS_REPORT.keys():
        if key in new_data and new_data[key] is not None:
            data[key] = new_data[key]
    data = compute_auto_totals(data)
    path = get_report_file_path()
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
    return data
