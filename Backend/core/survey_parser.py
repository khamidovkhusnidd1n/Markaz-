"""
Word (.docx and legacy .doc) parser for Survey questions.
Works cross-platform (Windows & Linux) without requiring Microsoft Word installed.
"""
import io
import re
import struct
import zipfile
import xml.etree.ElementTree as ET


CYR_TO_LAT = {
    'А': 'A', 'а': 'a',
    'Б': 'B', 'б': 'b',
    'В': 'V', 'в': 'v',
    'Г': 'G', 'г': 'g',
    'Д': 'D', 'д': 'd',
    'Е': 'E', 'е': 'e',
    'Ё': 'Yo', 'ё': 'yo',
    'Ж': 'J', 'ж': 'j',
    'З': 'Z', 'з': 'z',
    'И': 'I', 'и': 'i',
    'Й': 'Y', 'й': 'y',
    'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l',
    'М': 'M', 'м': 'm',
    'Н': 'N', 'н': 'n',
    'О': 'O', 'о': 'o',
    'П': 'P', 'п': 'p',
    'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's',
    'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u',
    'Ф': 'F', 'ф': 'f',
    'Х': 'X', 'х': 'x',
    'Ц': 'S', 'ц': 's',
    'Ч': 'Ch', 'ч': 'ch',
    'Ш': 'Sh', 'ш': 'sh',
    'Щ': 'Sh', 'щ': 'sh',
    'Ъ': '’', 'ъ': '’',
    'Ы': 'I', 'ы': 'i',
    'Ь': '', 'ь': '',
    'Э': 'E', 'э': 'e',
    'Ю': 'Yu', 'ю': 'yu',
    'Я': 'Ya', 'я': 'ya',
    'Ў': 'O‘', 'ў': 'o‘',
    'Қ': 'Q', 'қ': 'q',
    'Ғ': 'G‘', 'ғ': 'g‘',
    'Ҳ': 'H', 'ҳ': 'h',
}


def uz_cyr_to_lat(text: str) -> str:
    """Convert Uzbek Cyrillic text to Uzbek Latin cleanly."""
    if not text:
        return ''
    # Contextual 'Е'/'е' at start of word or after vowel -> 'Ye'/'ye'
    vowels = set('АЕЁИОУЫЭЮЯЎаеёиоуыэюяў')
    out = []
    for i, ch in enumerate(text):
        prev_ch = text[i - 1] if i > 0 else ' '
        if ch == 'Е' and (i == 0 or not prev_ch.isalnum() or prev_ch in vowels):
            out.append('Ye')
        elif ch == 'е' and (i == 0 or not prev_ch.isalnum() or prev_ch in vowels):
            out.append('ye')
        else:
            out.append(CYR_TO_LAT.get(ch, ch))
    res = ''.join(out)
    # Fix common Uzbek spelling details
    res = re.sub(r'\bXurmatli\b', 'Hurmatli', res)
    res = re.sub(r'\bxisoblaysiz\b', 'hisoblaysiz', res)
    res = re.sub(r'\bXa\b', 'Ha', res)
    res = re.sub(r'\bgurux\b', 'guruh', res)
    res = re.sub(r'\braxbarining\b', 'rahbarining', res)
    res = re.sub(r'\bkanday\b', 'qanday', res)
    res = re.sub(r'shart\s+sharoitlarlar', 'shart-sharoitlar', res)
    return res


def is_primarily_uzbek_cyrillic(text: str) -> bool:
    """Check if Cyrillic text is Uzbek Cyrillic (contains ў, қ, ғ, ҳ or Uzbek keywords)."""
    if not text:
        return False
    if any(ch in text for ch in 'ЎўҚқҒғҲҳ'):
        return True
    low = text.lower()
    return any(w in low for w in ('тингловчи', 'марказ', 'сўровнома', 'ўқитувчи', 'таълим'))


def extract_text_from_docx_bytes(raw_bytes: bytes) -> str:
    """Extract paragraph and table text from a .docx zip archive."""
    lines = []
    with zipfile.ZipFile(io.BytesIO(raw_bytes)) as zf:
        if 'word/document.xml' not in zf.namelist():
            raise ValueError("Not a valid .docx archive")
        xml_bytes = zf.read('word/document.xml')
    root = ET.fromstring(xml_bytes)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    for elem in root.iter():
        tag = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
        if tag == 'p':
            texts = [t.text for t in elem.findall('.//w:t', ns) if t.text]
            line = ''.join(texts).strip()
            if line:
                lines.append(line)
    return '\n'.join(lines)


def extract_text_from_doc_bytes(raw_bytes: bytes) -> str:
    """
    Pure-Python extractor for MS Word 97-2003 binary .doc (OLE2 Compound Document).
    Parses the WordDocument stream FIB + Clx piece table, with UTF-16LE fallback.
    """
    # Try parsing OLE2 sectors to extract WordDocument stream
    try:
        text = _extract_ole2_word_text(raw_bytes)
        if text and len(text.strip()) > 40:
            return text
    except Exception:
        pass

    # Fallback: scan UTF-16LE blocks in raw bytes
    u16 = raw_bytes.decode('utf-16le', errors='ignore')
    candidates = []
    for m in re.finditer(r'[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ0-9\s.,:;?!()"\'«»“”‘’ʻʼ\-–—/№%+_\r\n\t]{30,}', u16):
        chunk = m.group(0).strip()
        alpha_cnt = sum(c.isalpha() for c in chunk)
        if alpha_cnt >= 20:
            candidates.append((alpha_cnt, chunk))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1].replace('\r', '\n')
    return ''


def _extract_ole2_word_text(data: bytes) -> str:
    if data[:8] != b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1':
        raise ValueError("Not an OLE2 file")

    sector_shift = struct.unpack_from('<H', data, 0x1E)[0]
    sector_size = 1 << sector_shift
    num_fat_sectors = struct.unpack_from('<I', data, 0x2C)[0]
    first_dir_sector = struct.unpack_from('<I', data, 0x30)[0]
    first_difat_sector = struct.unpack_from('<I', data, 0x44)[0]
    num_difat_sectors = struct.unpack_from('<I', data, 0x48)[0]

    def sector_offset(sec_id: int) -> int:
        return (sec_id + 1) * sector_size

    difat = list(struct.unpack_from('<109I', data, 0x4C))
    curr_difat = first_difat_sector
    for _ in range(num_difat_sectors):
        if curr_difat >= 0xFFFFFFFE:
            break
        off = sector_offset(curr_difat)
        entries = struct.unpack_from(f'<{sector_size // 4}I', data, off)
        difat.extend(entries[:-1])
        curr_difat = entries[-1]

    fat = []
    for sec_id in difat[:num_fat_sectors]:
        if sec_id >= 0xFFFFFFFE:
            continue
        off = sector_offset(sec_id)
        fat.extend(struct.unpack_from(f'<{sector_size // 4}I', data, off))

    def read_chain(start_sec: int, size: int | None = None) -> bytes:
        buf = bytearray()
        sec = start_sec
        visited = set()
        while sec < 0xFFFFFFFE and sec not in visited and sec < len(fat):
            visited.add(sec)
            off = sector_offset(sec)
            buf.extend(data[off:off + sector_size])
            if size is not None and len(buf) >= size:
                return bytes(buf[:size])
            sec = fat[sec]
        return bytes(buf)

    dir_bytes = read_chain(first_dir_sector)
    streams = {}
    for i in range(0, len(dir_bytes), 128):
        entry = dir_bytes[i:i + 128]
        if len(entry) < 128:
            break
        name_len = struct.unpack_from('<H', entry, 64)[0]
        if name_len <= 2:
            continue
        name = entry[:name_len - 2].decode('utf-16le', errors='ignore')
        start_sec = struct.unpack_from('<I', entry, 116)[0]
        stream_size = struct.unpack_from('<I', entry, 120)[0]
        streams[name] = (start_sec, stream_size)

    if 'WordDocument' not in streams:
        raise ValueError("No WordDocument stream")

    wd_sec, wd_size = streams['WordDocument']
    wd = read_chain(wd_sec, wd_size)

    flags = struct.unpack_from('<H', wd, 0x0A)[0]
    table_name = '1Table' if (flags & 0x0200) else '0Table'
    fc_clx = struct.unpack_from('<I', wd, 0x01A2)[0]
    lcb_clx = struct.unpack_from('<I', wd, 0x01A6)[0]

    if table_name in streams and lcb_clx > 0:
        t_sec, t_size = streams[table_name]
        tbl = read_chain(t_sec, t_size)
        clx = tbl[fc_clx:fc_clx + lcb_clx]
        pos = 0
        while pos < len(clx) and clx[pos] == 1:
            cb = struct.unpack_from('<H', clx, pos + 1)[0]
            pos += 3 + cb
        if pos < len(clx) and clx[pos] == 2:
            lcb_pcd = struct.unpack_from('<I', clx, pos + 1)[0]
            plc_pcd = clx[pos + 5:pos + 5 + lcb_pcd]
            n = (lcb_pcd - 4) // 12
            cps = struct.unpack_from(f'<{n + 1}I', plc_pcd, 0)
            pcds_off = 4 * (n + 1)
            pieces = []
            for idx in range(n):
                pcd = plc_pcd[pcds_off + idx * 8:pcds_off + (idx + 1) * 8]
                fc_val = struct.unpack_from('<I', pcd, 2)[0]
                char_count = cps[idx + 1] - cps[idx]
                is_ansi = bool(fc_val & 0x40000000)
                fc_real = (fc_val & 0x3FFFFFFF) >> (1 if is_ansi else 0)
                if is_ansi:
                    raw_piece = wd[fc_real:fc_real + char_count]
                    pieces.append(raw_piece.decode('cp1251', errors='ignore'))
                else:
                    raw_piece = wd[fc_real:fc_real + char_count * 2]
                    pieces.append(raw_piece.decode('utf-16le', errors='ignore'))
            full_text = ''.join(pieces)
            ccp_text = struct.unpack_from('<I', wd, 0x004C)[0]
            if ccp_text > 0:
                full_text = full_text[:ccp_text]
            return full_text.replace('\r', '\n').replace('\x07', '\n')

    raise ValueError("Piece table not parsed")


def extract_text_from_word_file(file_obj_or_path) -> str:
    """Accepts a file path, Django FieldFile, or UploadedFile and returns extracted plain text."""
    if isinstance(file_obj_or_path, str):
        with open(file_obj_or_path, 'rb') as f:
            raw_bytes = f.read()
    else:
        file_obj_or_path.seek(0)
        raw_bytes = file_obj_or_path.read()
        file_obj_or_path.seek(0)

    # Check if valid .docx first
    try:
        return extract_text_from_docx_bytes(raw_bytes)
    except Exception:
        return extract_text_from_doc_bytes(raw_bytes)


def parse_survey_from_word(file_obj_or_path) -> dict:
    """
    Parse a Word document (.docx or .doc) into structured survey dictionary:
    {
      'description': str,
      'thanks_message': str,
      'questions': [
        {
          'order': int,
          'question_text': str,
          'question_type': 'single' | 'multiple' | 'text' | 'yes_no' | 'rating',
          'is_required': bool,
          'options': list[str],
          'has_detail_input': bool,
          'detail_trigger': str,
          'detail_label': str,
        },
        ...
      ]
    }
    """
    raw_text = extract_text_from_word_file(file_obj_or_path)
    if not raw_text or not raw_text.strip():
        return {'description': '', 'thanks_message': '', 'questions': []}

    # Convert Uzbek Cyrillic to clean Uzbek Latin so it matches the website
    if is_primarily_uzbek_cyrillic(raw_text):
        raw_text = uz_cyr_to_lat(raw_text)

    raw_lines = [ln.strip() for ln in raw_text.splitlines() if ln.strip()]

    q_start_re = re.compile(r'^(\d{1,2})\s*[.)\-]\s*(.+)$')
    thanks_re = re.compile(r'(tashakkur|rahmat|minnatdorchilik|soha rivojiga)', re.IGNORECASE)

    intro_lines = []
    thanks_lines = []
    raw_questions = []
    current_q = None

    for ln in raw_lines:
        # Clean stray control chars
        ln = re.sub(r'[\x00-\x08\x0b-\x1f]', '', ln).strip()
        if not ln:
            continue

        m = q_start_re.match(ln)
        if m:
            if current_q:
                raw_questions.append(current_q)
            current_q = {
                'num': int(m.group(1)),
                'question_text': m.group(2).strip(),
                'body_lines': [],
            }
            continue

        if current_q is None:
            # Skip main title line if it's just "SO'ROVNOMA"
            if ln.upper() in ("SO'ROVNOMA", "SO‘ROVNOMA", "ANKETA"):
                continue
            intro_lines.append(ln)
        else:
            if thanks_re.search(ln) and not ln.startswith('_'):
                thanks_lines.append(ln)
            else:
                current_q['body_lines'].append(ln)

    if current_q:
        raw_questions.append(current_q)

    parsed_questions = []
    seen_texts = set()

    for rq in raw_questions:
        q_text = re.sub(r'\s+', ' ', rq['question_text']).strip()
        norm_q = re.sub(r'[^a-z0-9]', '', q_text.lower())
        # Deduplicate accidental duplicate questions in the Word file (like Q6 & Q7 in SO'ROVNOMA.doc)
        if norm_q in seen_texts:
            continue
        seen_texts.add(norm_q)

        body = rq['body_lines']
        options = []
        has_detail = False
        detail_trigger = ''
        detail_label = ''
        is_text_only = False

        # Separate underscore-only lines from content lines
        non_underscore_lines = [b for b in body if not re.match(r'^_+$', b.strip())]
        has_underscore_lines = any('_' in b for b in body)

        # Check if this is an open text question (e.g. "O'qituvchi(lar)ning ismini yozing", "Taklif va fikringizni...")
        open_prompt_re = re.compile(
            r"(ismini\s+yozing|fikringizni\s+qisqacha|bayon\s+eting|taklifingizni\s+yozing|izoh\s+qoldiring)",
            re.IGNORECASE
        )

        if len(non_underscore_lines) == 0:
            is_text_only = True
        elif len(non_underscore_lines) == 1 and open_prompt_re.search(non_underscore_lines[0]):
            is_text_only = True
            detail_label = non_underscore_lines[0].rstrip(':').strip()
        else:
            # Parse options from non_underscore_lines
            for bline in non_underscore_lines:
                # Check if line has trailing underscores like "Boshqa_______" or "Ba'zilar tomonidan taklif bo'ldi _____"
                if '___' in bline:
                    opt_part = re.sub(r'_+', '', bline).strip().rstrip(':.').strip()
                    if opt_part:
                        options.append(opt_part)
                        has_detail = True
                        detail_trigger = opt_part
                        detail_label = "Iltimos, qisqacha izoh yozing:"
                    continue

                # Split multiple options on the same line separated by 2+ spaces or tabs
                parts = [p.strip().rstrip('.').strip() for p in re.split(r'\s{2,}|\t+', bline) if p.strip()]
                for p in parts:
                    # Remove leading a), b), •, -
                    clean_p = re.sub(r'^(?:[a-zA-Zа-яА-Я]\)|[•\-–])\s*', '', p).rstrip('.').strip()
                    if clean_p and not re.match(r'^_+$', clean_p):
                        options.append(clean_p)

        if is_text_only or not options:
            q_type = 'text'
            is_req = False
        else:
            q_type = 'single'
            is_req = True

        parsed_questions.append({
            'order': len(parsed_questions) + 1,
            'question_text': q_text,
            'question_type': q_type,
            'is_required': is_req,
            'options': options,
            'has_detail_input': has_detail,
            'detail_trigger': detail_trigger,
            'detail_label': detail_label,
        })

    return {
        'description': '\n\n'.join(intro_lines).strip(),
        'thanks_message': '\n'.join(thanks_lines).strip(),
        'questions': parsed_questions,
    }
