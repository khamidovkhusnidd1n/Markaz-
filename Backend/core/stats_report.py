import json
import os
from django.conf import settings

DEFAULT_STATS_REPORT = {
    "mo_total": 1743,
    "mo_higher_edu": 284,
    "mo_culture_ministry": 740,
    "mo_art_academy": 578,
    "mo_short_courses": 141,
    "qt_total": 389,
    "qt_painting": 0,
    "qt_embroidery": 0,
    "qt_gold_embroidery": 0,
    "intl_countries_count": 10,
    "intl_countries_list": "Italiya\nXitoy\nGruziya\nBelarus\nTurkiya\nRossiya\nHindiston\nQozog'iston\nKoreya\nOzarbayjon",
    "intl_organizations_count": 15,
    "intl_organizations_list": "",
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
