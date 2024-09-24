export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Harich Jewelry",
  brand: "Harich Jewelry",
  company: "PT Harich Terang Nusantara",
  url: "https://harich-jewelry.vercel.app",
  description: "Timeless Elegance – Fine Jewelry for Every Occasion",
  email: "mail@goosh.id",
  phone: "+6282318270480",
  links: {
    condition_guide: "/pages/item-condition-guide",
    policy: "/pages/quality-control-return-policy",
    whatsapp: `https://api.whatsapp.com/send?phone=6282318270480&text=${encodeURIComponent("Hi Goosh, I want to ask about...")}&type=phone_number`,
    instagram: "https://www.instagram.com/goosh_id/",
    tiktok: "https://tiktok.com",
  },
};
