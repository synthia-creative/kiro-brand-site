export const brand = {
  name: "KIRO",
  productName: "焦がしキャラメルサブレ",
  englishName: "BURNT CARAMEL SABLE",
  tagline: "ぱきっ、とろっ、もうひとつ。",
  taglineLines: ["ぱきっ、", "とろっ、", "もうひとつ。"],
  price: "¥1,480",
  quantity: "6 PIECES",
  colors: {
    orange: "#EF762C",
    ivory: "#FFF5DE",
    brown: "#382015",
    burnt: "#512B1D",
    butter: "#F5D783",
  },
  images: {
    package: "/images/kiro/package.webp",
    whole: "/images/kiro/sable.webp",
    broken: "/images/kiro/sable-break.webp",
  },
  story: {
    heading: ["焦がすことで、", "甘さはもっと深くなる。"],
    paragraphs: [
      "KIROの焦がしキャラメルサブレは、香ばしく焼き上げたバターサブレに、ほろ苦く濃厚なキャラメルクリームを挟んだ焼き菓子。",
      "さくっと割ったその瞬間、焦がしキャラメルの香りがふわっと広がります。",
    ],
  },
  taste: [
    { title: "BUTTER", copy: "香ばしく焼き上げた、厚みのあるバターサブレ。" },
    { title: "CARAMEL", copy: "甘さの奥に、ほんの少しのほろ苦さ。" },
    { title: "TEXTURE", copy: "ぱきっ。そのあと、とろっ。" },
  ],
  storeUrl: null as string | null,
  isDemo: true,
};
