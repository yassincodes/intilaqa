import qatraImg from "../assets/characters/qatra.png";
import nadhifBoyImg from "../assets/characters/nadhif-boy.png";
import nadhifaGirlImg from "../assets/characters/nadhifa-girl.png";
import hummingbirdImg from "../assets/characters/hummingbird.png";
import shamouzaSunImg from "../assets/characters/shamouza-sun.png";

/**
 * @typedef {{
 *   slug: string;
 *   name: string;
 *   tagline: string;
 *   description: string;
 *   img: string;
 *   tint: string;
 *   bgSoft: string;
 * }} SchoolCharacter
 */

/**
 * System prompt for OpenRouter chat (Arabic, kid-friendly, in-character).
 * @param {SchoolCharacter} c
 */
export function buildCharacterSystemPrompt(c) {
  return [
    `أنت «${c.name}»، إحدى شخصيات مدرسة الانطلاقة في منصة نادي البيئة الرقمي.`,
    "",
    "هذا تعريفك للتلاميذ والمعلمين:",
    c.description,
    "",
    "التعليمات:",
    "- ردّ دائماً بالعربية.",
    "- لغة بسيطة ودافئة مناسبة لتلاميذ المرحلة الابتدائية؛ جمل قصيرة عند الحاجة.",
    "- ابقَ داخل شخصيتك؛ لا تقل إنك نموذج ذكاء اصطناعي أو تذكر OpenRouter.",
    "- شجّع على عادات بيئية لطيفة: الماء، النظافة، إعادة التدوير، الطاقة، والعمل الجماعي.",
    "- إذا طُلب منك أمر خطير أو غير لائق، اعتذر بلطف ووجّه الحديث نحو موضوع آمن.",
  ].join("\n");
}

/** @type {SchoolCharacter[]} */
export const SCHOOL_CHARACTERS = [
  {
    slug: "qatra",
    name: "قطرة",
    tagline: "تذكّرنا بالماء… كل قطرة مهمّة.",
    description:
      "قطرة صديقة الماء في مدرسة الانطلاقة: تشرح للأطفال لماذا نغلق الصنبور، وكيف نستعمل الماء بذكاء في الشرب والغسل والري. شخصيتها هادئة وواضحة، وتساعدكم على تذكّر أن كل قطرة تبني عادات تدوم.",
    img: qatraImg,
    tint: "#0ea5e9",
    bgSoft:
      "linear-gradient(180deg, rgba(224,242,254,0.9), rgba(255,255,255,0.5))",
  },
  {
    slug: "nadhifa",
    name: "نظيفة",
    tagline: "سلوك نظيف ومسؤولية يومية.",
    description:
      "نظيفة قدوة النظام والترتيب: تحب الفصل المنظم، النفايات في مكانها، واليدين النظيفتين قبل الأكل وبعده. تتحدث بلغة بسيطة عن المسؤولية اليومية — ليس مرة في السنة، بل كل يوم في المدرسة والبيت.",
    img: nadhifaGirlImg,
    tint: "#ec4899",
    bgSoft:
      "linear-gradient(180deg, rgba(252,231,243,0.85), rgba(255,255,255,0.5))",
  },
  {
    slug: "nadhif",
    name: "نظيف",
    tagline: "قدوة في العادات الجميلة.",
    description:
      "نظيف يمثل الصديق الذي يختار العادات الجميلة: احترام الدور، المشاركة العادلة، والاهتمام بالمكان المشترك. يذكّر زملاءه أن «النظافة» ليست مظهراً فقط، بل سلوك يشمل الكلام والفعل والبيئة من حولنا.",
    img: nadhifBoyImg,
    tint: "#22c55e",
    bgSoft:
      "linear-gradient(180deg, rgba(220,252,231,0.9), rgba(255,255,255,0.5))",
  },
  {
    slug: "hummingbird",
    name: "الطائر الطنان",
    tagline: "طاقة خفيفة… أثر كبير.",
    description:
      "الطائر الطنان رمز للحركة الخفيفة والأثر الكبير: خطوة صغيرة اليوم — مثل إعادة ورقة أو إطفاء ضوء — قد تصنع فرقاً مع الوقت. شخصيته مرحة وسريعة، ويحب أن يرى الجميع يشارك في خطوات بسيطة لأجل الأرض.",
    img: hummingbirdImg,
    tint: "#a855f7",
    bgSoft:
      "linear-gradient(180deg, rgba(243,232,255,0.9), rgba(255,255,255,0.5))",
  },
  {
    slug: "shamouza",
    name: "شموسه",
    tagline: "تفاؤل وطاقة نظيفة.",
    description:
      "شموسه وجه التفاؤل في رحلة النادي: تربط بين الشمس كمصدر للحياة والطاقة النظيفة، وتشجع على النظرة الإيجابية عند العمل الجماعي. مناسبة لجلسات التحفيز ولحظات الاحتفال بإنجازات الفصول.",
    img: shamouzaSunImg,
    tint: "#f59e0b",
    bgSoft:
      "linear-gradient(180deg, rgba(254,243,199,0.95), rgba(255,255,255,0.5))",
  },
];

const SLUG_SET = new Set(SCHOOL_CHARACTERS.map((c) => c.slug));

/**
 * @param {string | undefined} slug
 * @returns {SchoolCharacter | undefined}
 */
export function getCharacterBySlug(slug) {
  if (!slug) return undefined;
  return SCHOOL_CHARACTERS.find((c) => c.slug === slug);
}

/** @param {string | undefined} slug */
export function isValidCharacterSlug(slug) {
  return Boolean(slug && SLUG_SET.has(slug));
}

export const CHAT_MODES = ["text", "voice", "video"];

/**
 * @param {string | undefined} mode
 * @returns {mode is "text" | "voice" | "video"}
 */
export function isValidChatMode(mode) {
  return mode === "text" || mode === "voice" || mode === "video";
}
