/**
 * أعضاء النادي — حدّث القائمة أدناه عند الحاجة.
 * مسار كل عضو: /@<handle> (مثال: /@mohamed_yassin). الروابط القديمة /students/<slug> تُحوَّل تلقائياً.
 */
const STUDENT_ROWS = [
  { name: "ألاء غبارو", handle: "alaa_ghabarou" },
  { name: "يوسف سليمان", handle: "yousef_sulayman" },
  { name: "ريان معيز", handle: "rayan_maeez" },
  { name: "خديجة عبور", handle: "khadija_abour" },
  { name: "مجدي الجزيري", handle: "magdi_aljazeeri" },
  { name: "بشير بن عبد الله", handle: "bashir_abdallah" },
  { name: "أمين العلوي", handle: "amin_alalawi" },
  { name: "نوران بن يونس", handle: "nouran_benyounis" },
  { name: "لميس المي", handle: "lamees_almay" },
  { name: "نور الهدى غميض", handle: "nour_alhuda_ghameed" },
  { name: "شمس البدور البجاوي", handle: "shams_albudoor_albajawi" },
  { name: "ألما كريستو", handle: "alma_kristo" },
  { name: "آدم بن قارة", handle: "adam_ben_qara" },
  { name: "تقوى صدور", handle: "taqwa_sudoor" },
  { name: "محمد علي عياد", handle: "mohamed_ali_iyyad" },
  { name: "محمد ياسين سليمان", handle: "mohamed_yassin" },
  { name: "سارة ديلو", handle: "sara_dilo" },
  { name: "ريم المبروك", handle: "reem_almabrouk" },
  { name: "يوسف جعفر", handle: "yousef_jafar" },
];

/** يحوّل الاسم الكامل إلى مقطع مسار قديم: «محمد ياسين سليمان» → «محمد-ياسين-سليمان». */
function nameToSlug(name) {
  return name.trim().split(/\s+/).filter(Boolean).join("-");
}

/** @param {typeof STUDENT_ROWS} rows */
function buildStudentEntries(rows) {
  const takenSlugs = new Set();
  const takenHandles = new Set();
  return rows.map(({ name, handle }) => {
    const normalizedHandle = String(handle)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
    let uniqueHandle = normalizedHandle;
    let hn = 2;
    while (takenHandles.has(uniqueHandle)) {
      uniqueHandle = `${normalizedHandle}_${hn}`;
      hn += 1;
    }
    takenHandles.add(uniqueHandle);

    let slug = nameToSlug(name);
    let finalSlug = slug;
    let sn = 2;
    while (takenSlugs.has(finalSlug)) {
      finalSlug = `${slug}-${sn}`;
      sn += 1;
    }
    takenSlugs.add(finalSlug);
    return { name, handle: uniqueHandle, slug: finalSlug };
  });
}

export const STUDENTS = buildStudentEntries(STUDENT_ROWS);

/** أسماء فقط (للتوافق مع أي استيراد قديم) */
export const STUDENT_NAMES = STUDENTS.map((s) => s.name);

/** مسار الشارة لعرض الرابط أو المشاركة */
export function studentProfilePath(handle) {
  const h = String(handle).replace(/^@/, "").trim();
  return h ? `/@${encodeURIComponent(h)}` : "/students";
}

/** @param {string} handle بدون @، من useParams أو شريط العنوان */
export function getStudentByHandle(handle) {
  if (!handle) return null;
  try {
    const raw = decodeURIComponent(handle).replace(/^@/, "").trim().toLowerCase();
    return STUDENTS.find((s) => s.handle === raw) ?? null;
  } catch {
    const raw = String(handle).replace(/^@/, "").trim().toLowerCase();
    return STUDENTS.find((s) => s.handle === raw) ?? null;
  }
}

/** @param {string} slug من useParams (decoded) — مسارات /students/ القديمة */
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
