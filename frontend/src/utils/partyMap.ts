// src/utils/partyMap.ts
import { Party } from "@/types/dashboard";

export const partyLabels: Record<Party, string> = {
  lab: "Labour",
  con: "Conservative",
  ld: "Liberal Democrats",
  green: "Green",
  reform: "Reform UK",
  snp: "SNP",
  other: "Other",
};

export const partyColors: Record<Party, string> = {
  lab: "#E4003B",
  con: "#0087DC",
  ld: "#FAA61A",
  green: "#6AB023",
  reform: "#12B6CF",
  snp: "#FDF38E",
  other: "#888888",
};

export const partyLogos: Record<Party, string> = {
  lab: "/logos/labour.png",
  con: "/logos/conservative.svg.png",
  ld: "/logos/libdem.png",
  green: "/logos/green.svg.png",
  reform: "/logos/reform.svg.png",
  snp: "/logos/snp.svg.png",
  other: "/logos/other.png", 
};

// New extended metadata
export const partyInfo: Record<
  Party,
  { slogan: string; policies: string[]; voters: string }
> = {
  lab: {
    slogan: "For the many, not the few",
    policies: ["NHS funding", "Workers' rights", "Welfare spending"],
    voters: "Younger voters, working-class, urban areas",
  },
  con: {
    slogan: "Strong leadership, secure future",
    policies: ["Tax cuts", "Strong borders", "Free market economy"],
    voters: "Older voters, homeowners, rural and suburban areas",
  },
  ld: {
    slogan: "Demand better",
    policies: ["Pro-Europe", "Education investment", "Civil liberties"],
    voters: "Graduates, middle-income professionals, Remain voters",
  },
  green: {
    slogan: "Fairer, Greener Future",
    policies: ["Climate action", "Renewable energy", "Social justice"],
    voters: "Young urban progressives, environmentalists",
  },
  reform: {
    slogan: "Britain Deserves Better",
    policies: ["Immigration reform", "Cut red tape", "Lower taxes"],
    voters: "Right-leaning, anti-establishment voters",
  },
  snp: {
    slogan: "Stronger for Scotland",
    policies: ["Scottish independence", "Public services", "Progressive tax"],
    voters: "Scottish voters, pro-independence supporters",
  },
  other: {
    slogan: "Local voices matter",
    policies: ["Regional priorities", "Community issues"],
    voters: "Local and independent party supporters",
  },
};
