import { Party } from "@/types/dashboard";

export interface PartyMetadata {
  name: string;
  color: string;
  logo: string;
  slogan: string;
  policies: string[];
  voters: string;
  description: string;
  
}

export const partyDisplayMap: Record<Party, PartyMetadata> = {
  lab: {
    name: "Labour",
    color: "#E4003B",
    logo: "https://destiny-election-predictor-frontend.s3.eu-north-1.amazonaws.com/logos/labour.png",
    slogan: "For the many, not the few",
    policies: ["NHS funding", "Workers' rights", "Welfare spending"],
    voters: "Younger voters, working-class, urban areas",
    description:
      "Centre-left party focused on expanding public services, improving workers’ rights, and reducing inequality.",
  },
  con: {
    name: "Conservative",
    color: "#0087DC",
    logo: "https://destiny-election-predictor-frontend.s3.eu-north-1.amazonaws.com/logos/conservative.svg.png",
    slogan: "Strong leadership, secure future",
    policies: ["Tax cuts", "Strong borders", "Free market economy"],
    voters: "Older voters, homeowners, rural and suburban areas",
    description:
      "Centre-right party promoting free market economics, lower taxes, and national security.",
  },
  ld: {
    name: "Liberal Democrats",
    color: "#FAA61A",
    logo: "https://destiny-election-predictor-frontend.s3.eu-north-1.amazonaws.com/logos/libdem.png",
    slogan: "Demand better",
    policies: ["Pro-Europe", "Education investment", "Civil liberties"],
    voters: "Graduates, middle-income professionals, Remain voters",
    description:
      "Centrist party advocating for pro-European policies, civil liberties, and education investment.",
  },
  green: {
    name: "Green",
    color: "#6AB023",
    logo: "https://destiny-election-predictor-frontend.s3.eu-north-1.amazonaws.com/logos/green.svg.png", // ✅ Fixed
    slogan: "Fairer, Greener Future",
    policies: ["Climate action", "Renewable energy", "Social justice"],
    voters: "Young urban progressives, environmentalists",
    description:
      "Progressive party prioritising environmental sustainability, renewable energy, and social equality.",
  },
  reform: {
    name: "Reform UK",
    color: "#12B6CF",
    logo: "https://destiny-election-predictor-frontend.s3.eu-north-1.amazonaws.com/logos/reform.svg.png", // ✅ Fixed
    slogan: "Britain Deserves Better",
    policies: ["Immigration reform", "Cut red tape", "Lower taxes"],
    voters: "Right-leaning, anti-establishment voters",
    description:
      "Right-wing populist party focused on immigration reform, cutting bureaucracy, and reducing taxes.",
  },
  snp: {
    name: "SNP",
    color: "#FDF38E",
    logo: "https://destiny-election-predictor-frontend.s3.eu-north-1.amazonaws.com/logos/snp.svg",
    slogan: "Stronger for Scotland",
    policies: ["Scottish independence", "Public services", "Progressive tax"],
    voters: "Scottish voters, pro-independence supporters",
    description:
      "Social democratic party campaigning for Scottish independence and progressive public policies.",
  },
  other: {
    name: "Other",
    color: "#888888",
    logo: "https://destiny-election-predictor-frontend.s3.eu-north-1.amazonaws.com/logos/other.png",
    slogan: "Local voices matter",
    policies: ["Regional priorities", "Community issues"],
    voters: "Local and independent party supporters",
    description:
      "A mix of smaller parties and independents representing local, regional, and community-based issues.",
  },
};


// Extra exports
export const partyLabels = Object.fromEntries(
  Object.entries(partyDisplayMap).map(([key, val]) => [key, val.name])
);

export const partyColors = Object.fromEntries(
  Object.entries(partyDisplayMap).map(([key, val]) => [key, val.color])
);

export const partyLogos = Object.fromEntries(
  Object.entries(partyDisplayMap).map(([key, val]) => [key, val.logo])
);

export const partyInfo = Object.fromEntries(
  Object.entries(partyDisplayMap).map(([key, val]) => [key, val])
);
