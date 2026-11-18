# Xavfsizlik Siyosati (Security Policy) — uzbamalaka.uz

O'zbekiston Badiiy akademiyasi huzuridagi Badiiy ta'lim yo'nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi rasmiy veb-saytining axborot xavfsizligi siyosati.

Ushbu siyosat O'zbekiston Respublikasining "Kiberxavfsizlik to'g'risida"gi Qonuni, O'z DSt ISO/IEC 27001 standarti hamda O'zbekiston Respublikasi Kiberxavfsizlik markazi (UZCERT) talablari asosida shakllantirilgan.

## Zaifliklar haqida xabar berish (Reporting a Vulnerability)

Agar siz saytda yoki unga tegishli infratuzilmada xavfsizlik zaifligini aniqlasangiz, quyidagi tartibda xabar berishingizni so'raymiz:

1. **Aloqa kanali:**
   - E-mail: `security@uzbamalaka.uz` yoki `info@uzbamalaka.uz`
   - Rasmiy telefon: `+998 (71) 232-15-28`
2. **Xabar shakli:**
   - Zaiflik turi (masalan, OWASP Top 10 toifasi)
   - Zaiflik aniqlangan URL yoki endpoint
   - Qayta takrorlash qadamlari (PoC / Proof of Concept)
   - Kutilayotgan xavf darajasi (Severity)
3. **Javob berish muddati:**
   - Kelib tushgan xabarlar **48 soat** ichida birlamchi ko'rib chiqiladi va tasdiqlanadi.
   - Zaiflikni bartaraf etish muddatlari xavf darajasiga qarab 1 kundan 7 ish kunigacha belgilanadi.

## Xavfsizlik Doirasi (Scope)

### Doiradagi resurslar (In Scope):
- `https://uzbamalaka.uz/` va `https://www.uzbamalaka.uz/`
- Barcha ochiq API endpointlar (`/api/*`)

### Doiradan tashqari resurslar (Out of Scope):
- DoS/DDoS (xizmatni to'xtatishga qaratilgan ommaviy so'rovlar)
- Ijtimoiy muhandislik (Social engineering / Phishing)
- Xodimlarning shaxsiy qurilmalari va ofis lokal tarmog'i

## Mas'uliyatli Oshkor Qilish (Responsible Disclosure)

- Zaiflikni ommaga e'lon qilishdan oldin uni bartaraf etish uchun markaz ma'murlariga yetarli vaqt bering.
- Foydalanuvchilarning shaxsiy ma'lumotlariga noqonuniy kirish yoki ularni o'zgartirishdan saqlaning.
- Tizim faoliyatini to'xtatuvchi destruktiv harakatlarni amalga oshirmang.
