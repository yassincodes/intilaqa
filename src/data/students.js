/**
 * أعضاء النادي — حدّث القائمة أدناه عند الحاجة.
 * مسار كل عضو: /@<handle> (مثال: /@mohamed_yassin). الروابط القديمة /students/<slug> تُحوَّل تلقائياً.
 */
/** @typedef {'m' | 'f'} StudentGender — للتصريف في النصوص العربية (ذكر / أنثى). */
const STUDENT_ROWS = [
  { name: "ألاء غبارو", handle: "alaa_ghabarou", gender: "f" },
  { name: "يوسف سليمان", handle: "yousef_sulayman", gender: "m" },
  { name: "ريان معيز", handle: "rayan_maeez", gender: "m" },
  { name: "خديجة عبور", handle: "khadija_abour", gender: "f" },
  { name: "مجدي الجزيري", handle: "magdi_aljazeeri", gender: "m" },
  { name: "بشير بن عبد الله", handle: "bashir_abdallah", gender: "m" },
  { name: "أمين العلوي", handle: "amin_alalawi", gender: "m" },
  { name: "نوران بن يونس", handle: "nouran_benyounis", gender: "f" },
  { name: "لميس المي", handle: "lamees_almay", gender: "f" },
  { name: "نور الهدى غميض", handle: "nour_alhuda_ghameed", gender: "f" },
  { name: "شمس البدور البجاوي", handle: "shams_albudoor_albajawi", gender: "f" },
  { name: "ألما كريستو", handle: "alma_kristo", gender: "f" },
  { name: "آدم بن قارة", handle: "adam_ben_qara", gender: "m" },
  { name: "تقوى صدور", handle: "taqwa_sudoor", gender: "f" },
  { name: "محمد علي عياد", handle: "mohamed_ali_iyyad", gender: "m" },
  { name: "محمد ياسين سليمان", handle: "mohamed_yassin", gender: "m" },
  { name: "سارة ديلو", handle: "sara_dilo", gender: "f" },
  { name: "ريم المبروك", handle: "reem_almabrouk", gender: "f" },
  { name: "يوسف جعفر", handle: "yousef_jafar", gender: "m" },
];

/** يحوّل الاسم الكامل إلى مقطع مسار قديم: «محمد ياسين سليمان» → «محمد-ياسين-سليمان». */
function nameToSlug(name) {
  return name.trim().split(/\s+/).filter(Boolean).join("-");
}

/** @param {typeof STUDENT_ROWS} rows */
function buildStudentEntries(rows) {
  const takenSlugs = new Set();
  const takenHandles = new Set();
  return rows.map(({ name, handle, gender }) => {
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
    const g = gender === "f" ? "f" : "m";
    return { name, handle: uniqueHandle, slug: finalSlug, gender: g };
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

/** مهارات بيئية مشتركة — النسب من الهاش حتى تبقى ثابتة لكل اسم (يُستبدل لاحقاً ببيانات حقيقية). */
const ECO_SKILL_DEFS = [
  { key: "ecoart", label: "الرسم البيئي", icon: "🎨" },
  { key: "trees", label: "غرس الأشجار", icon: "🌳" },
  { key: "speak", label: "التحدث أمام الجمهور", icon: "🎤" },
  { key: "recycle", label: "إعادة التدوير", icon: "♻️" },
  { key: "team", label: "العمل الجماعي", icon: "🤝" },
];

/** @returns {{ key: string, label: string, icon: string, percent: number }[]} */
export function getStudentSkills(name) {
  const h = hashName(name);
  return ECO_SKILL_DEFS.map((def, i) => {
    const n = (h + i * 7919 + def.key.charCodeAt(0) * 31) >>> 0;
    const percent = 28 + (n % 71);
    return { ...def, percent };
  });
}

/** عبارة قصيرة للملف — تُختار بثبات من الاسم (يُستبدل لاحقاً بنص يدوي). */
const STUDENT_BIOS = [
  "صديق الأرض",
  "حارس الواحة الخضراء",
  "نجم المبادرات البيئية",
  "صوت التوعية في النادي",
  "يد خضراء في المدرسة",
  "سفير إعادة التدوير",
  "روح الفريق البيئي",
  "محب الطبيعة والأشجار",
  "مبدع في الرسم البيئي",
  "متطوع في كل نشاط أخضر",
  "قائد مجموعة التشجير",
  "مثال يُحتذى في النظافة",
];

export function getStudentBio(name) {
  return STUDENT_BIOS[hashName(name) % STUDENT_BIOS.length];
}

/** منشورات يكتبها فريق المدرسة/النادي — نصوص جاهزة + تنويع بسيط بالاسم. */
const TIMELINE_LINES = [
  {
    icon: "🌱",
    m: "شارك في تنظيف ساحة المدرسة ضمن مبادرة «ساحتنا أجمل».",
    f: "شاركت في تنظيف ساحة المدرسة ضمن مبادرة «ساحتنا أجمل».",
  },
  {
    icon: "♻️",
    m: "ساهم في فرز القوارير البلاستيكية وإرسالها لمركز إعادة التدوير.",
    f: "ساهمت في فرز القوارير البلاستيكية وإرسالها لمركز إعادة التدوير.",
  },
  {
    icon: "🌳",
    m: "شارك في غرس شتلات جديدة في حديقة المدرسة.",
    f: "شاركت في غرس شتلات جديدة في حديقة المدرسة.",
  },
  {
    icon: "📢",
    m: "قدّم فقرة قصيرة عن أهمية ترشيد استهلاك الماء في طابور الصباح.",
    f: "قدّمت فقرة قصيرة عن أهمية ترشيد استهلاك الماء في طابور الصباح.",
  },
  {
    icon: "🎨",
    m: "ساهم في لوحة جدارية بيئية في الممرّ الرئيسي.",
    f: "ساهمت في لوحة جدارية بيئية في الممرّ الرئيسي.",
  },
  {
    icon: "🤝",
    m: "نظّم جانباً من العمل الجماعي في يوم البيئة المفتوح.",
    f: "نظّمت جانباً من العمل الجماعي في يوم البيئة المفتوح.",
  },
  {
    icon: "🌿",
    m: "التزم بتتبّع نقاطه الخضراء وتحسينها هذا الشهر.",
    f: "التزمت بتتبّع نقاطها الخضراء وتحسينها هذا الشهر.",
  },
  {
    icon: "✨",
    m: "شارك في مسابقة «أفضل عادة صديقة للبيئة» وحصل على إشادة.",
    f: "شاركت في مسابقة «أفضل عادة صديقة للبيئة» وحصلت على إشادة.",
  },
];

/** تواريخ للعرض: يوم + شهر + سنة (أرقام غربية). شهور: جانفي، فيفري، مارس، افريل. مارس من 1 إلى 13 فقط. */
const TIMELINE_DATE_SLOTS = [
  { day: 7, month: "جانفي", year: 2026 },
  { day: 22, month: "جانفي", year: 2026 },
  { day: 31, month: "جانفي", year: 2026 },
  { day: 4, month: "فيفري", year: 2026 },
  { day: 19, month: "فيفري", year: 2026 },
  { day: 27, month: "فيفري", year: 2026 },
  { day: 2, month: "مارس", year: 2026 },
  { day: 11, month: "مارس", year: 2026 },
  { day: 13, month: "مارس", year: 2026 },
  { day: 5, month: "افريل", year: 2026 },
  { day: 16, month: "افريل", year: 2026 },
  { day: 28, month: "افريل", year: 2026 },
  { day: 3, month: "جانفي", year: 2026 },
  { day: 15, month: "فيفري", year: 2026 },
  { day: 8, month: "مارس", year: 2026 },
  { day: 21, month: "افريل", year: 2026 },
];

/** @returns {{ id: string, icon: string, body: string, date: { day: number, month: string, year: number } }[]} */
export function getStudentTimeline(name, gender = "m") {
  const g = gender === "f" ? "f" : "m";
  const h = hashName(name);
  const first = name.trim().split(/\s+/)[0] ?? name;
  const n = 5;
  const out = [];
  const used = new Set();
  for (let i = 0; i < n; i += 1) {
    let idx = (h + i * 31 + i * i) % TIMELINE_LINES.length;
    let guard = 0;
    while (used.has(idx) && guard < TIMELINE_LINES.length) {
      idx = (idx + 1) % TIMELINE_LINES.length;
      guard += 1;
    }
    used.add(idx);
    const row = TIMELINE_LINES[idx];
    const lineBody = row[g];
    const date = TIMELINE_DATE_SLOTS[(h + i * 7) % TIMELINE_DATE_SLOTS.length];
    const body = i === 0 ? `${first} ${lineBody}` : lineBody;
    out.push({
      id: `${h}-${i}`,
      icon: row.icon,
      body,
      date,
    });
  }
  return out;
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
