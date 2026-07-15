"""The three physical offices. Must stay in sync with `site.offices`
in the frontend (src/lib/site.ts) — city names are the shared key."""

OFFICES = ["Vellore", "Arakkonam", "Ranipet"]
DEFAULT_OFFICE = "Vellore"  # head office — handles call/video consultations by default

# Working hours for consultation slots: Mon–Sat, 30-minute slots.
WORK_START_HOUR = 10  # 10:00
WORK_END_HOUR = 18    # last slot starts 17:30
