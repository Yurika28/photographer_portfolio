const CONTACT_CONFIG = [
  {
    label: "Instagram",
    env: "NEXT_PUBLIC_INSTAGRAM_URL",
    fallback: "https://instagram.com/geenphovid",
    isEmail: false,
  },
  {
    label: "WhatsApp",
    env: "NEXT_PUBLIC_WHATSAPP_URL",
    fallback: "https://wa.me/6285778051419",
    isEmail: false,
  },
  {
    label: "TikTok",
    env: "NEXT_PUBLIC_TIKTOK_URL",
    fallback: "https://www.tiktok.com/@geenphovid",
    isEmail: false,
  },
  {
    label: "Email",
    env: "NEXT_PUBLIC_EMAIL",
    fallback: "geenphovidproduction@gd9.biz.id",
    isEmail: true,
  },
] as const;

export const contactLinks = CONTACT_CONFIG.map((item) => {
  const value =
    process.env[item.env] && process.env[item.env]!.length > 0
      ? process.env[item.env]!
      : item.fallback;

  return {
    label: item.label,
    href: item.isEmail ? `mailto:${value}` : value,
  };
});
