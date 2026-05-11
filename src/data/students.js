/**
 * طلاب الفصل — أسماء العرض كما وردت (مع دمج التكرار الواضح لنفس الاسم).
 */
export const STUDENT_NAMES = [
  "آية",
  "أحمد",
  "أسيل",
  "ألمى",
  "أمين",
  "أيوب",
  "إسلام",
  "إيناس",
  "تقوى",
  "خميس",
  "خليل",
  "ريم",
  "ريان",
  "سارة",
  "سراط",
  "سليم",
  "شمس البدور",
  "فارس",
  "محمد علي",
  "مجدي",
  "مهدي",
  "محمد",
  "نديم",
  "نور الهدى",
  "نوران",
  "يوسف",
];

const KID_EMOJIS = ["👧", "👦", "🧒", "👩‍🎓", "👨‍🎓", "🧑‍🎓"];

function hashName(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const MEMBER_ACCENTS = [
  { ring: "#22c55e", glow: "rgba(34, 197, 94, 0.35)", chip: "rgba(34, 197, 94, 0.12)" },
  { ring: "#0ea5e9", glow: "rgba(14, 165, 233, 0.3)", chip: "rgba(14, 165, 233, 0.12)" },
  { ring: "#d97706", glow: "rgba(217, 119, 6, 0.32)", chip: "rgba(217, 119, 6, 0.14)" },
  { ring: "#a855f7", glow: "rgba(168, 85, 247, 0.28)", chip: "rgba(168, 85, 247, 0.12)" },
  { ring: "#ec4899", glow: "rgba(236, 72, 153, 0.26)", chip: "rgba(236, 72, 153, 0.1)" },
  { ring: "#14b8a6", glow: "rgba(20, 184, 166, 0.3)", chip: "rgba(20, 184, 166, 0.12)" },
];

export function getStudentProfile(name) {
  const h = hashName(name);
  return {
    emoji: KID_EMOJIS[h % KID_EMOJIS.length],
    roses: 8 + (h % 42),
    missions: 3 + (h % 28),
    greenPoints: 24 + (h % 180),
    accent: MEMBER_ACCENTS[h % MEMBER_ACCENTS.length],
  };
}
