/**
 * أعضاء النادي — حدّث القائمة أدناه عند الحاجة.
 * مسار كل عضو: /students/<الاسم-بشرطات> (مثال: محمد-ياسين-سليمان؛ عند تكرار الاسم الكامل يُضاف -2).
 */
export const STUDENT_NAMES = [
  "ألاء غبارو",
  "يوسف سليمان",
  "ريان معيز",
  "خديجة عبور",
  "مجدي الجزيري",
  "بشير بن عبد الله",
  "أمين العلوي",
  "نوران بن يونس",
  "لميس المي",
  "نور الهدى غميض",
  "شمس البدور البجاوي",
  "ألما كريستو",
  "آدم بن قارة",
  "تقوى صدور",
  "محمد علي عياد",
  "محمد ياسين سليمان",
  "سارة ديلو",
  "ريم المبروك",
  "يوسف جعفر",
];

/** يحوّل الاسم الكامل إلى مقطع مسار: «محمد ياسين سليمان» → «محمد-ياسين-سليمان». */
function nameToSlug(name) {
  return name.trim().split(/\s+/).filter(Boolean).join("-");
}

/** @param {string[]} names */
function buildStudentEntries(names) {
  const taken = new Set();
  return names.map((name) => {
    let slug = nameToSlug(name);
    let final = slug;
    let n = 2;
    while (taken.has(final)) {
      final = `${slug}-${n}`;
      n += 1;
    }
    taken.add(final);
    return { name, slug: final };
  });
}

export const STUDENTS = buildStudentEntries(STUDENT_NAMES);

/** @param {string} slug from useParams (decoded) */
export function getStudentBySlug(slug) {
  if (!slug) return null;
  try {
    const decoded = decodeURIComponent(slug);
    return STUDENTS.find((s) => s.slug === decoded) ?? null;
  } catch {
    return STUDENTS.find((s) => s.slug === slug) ?? null;
  }
}

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

/** لوحة نادي البيئة — مجاميع من بيانات الأعضاء (نفس منطق البطاقات الفردية). */
export function getEcoClubDashboardStats() {
  let completedInitiatives = 0;
  let greenPoints = 0;
  let symbolicTrees = 0;
  for (const { name } of STUDENTS) {
    const p = getStudentProfile(name);
    const h = hashName(name);
    completedInitiatives += p.missions;
    greenPoints += p.greenPoints;
    symbolicTrees += 1 + (h % 3);
  }
  return {
    activeMembers: STUDENTS.length,
    completedInitiatives,
    greenPoints,
    symbolicTrees,
  };
}
