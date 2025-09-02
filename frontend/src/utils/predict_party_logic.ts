import { Party } from "@/types/dashboard";

export interface PredictionOutput {
  winner: Party;
  probabilities: Record<Party, number>;
}

// Map of parties → display data
export const partyDisplayMap: Record<
  Party,
  {
    name: string;
    color: string;
    logo: string;
    slogan: string;
    policies: string[];
    voters: string;
  }
> = {
  lab: {
    name: "Labour",
    color: "#E4003B",
    logo: "/logos/labour.png",
    slogan: "For the many, not the few",
    policies: ["NHS funding", "Workers' rights", "Welfare spending"],
    voters: "Younger voters, working-class, urban areas",
  },
  con: {
    name: "Conservative",
    color: "#0087DC",
    logo: "/logos/conservative.svg.png",
    slogan: "Strong leadership, secure future",
    policies: ["Tax cuts", "Strong borders", "Free market economy"],
    voters: "Older voters, homeowners, rural and suburban areas",
  },
  ld: {
    name: "Liberal Democrats",
    color: "#FAA61A",
    logo: "/logos/libdem.png",
    slogan: "Demand better",
    policies: ["Pro-Europe", "Education investment", "Civil liberties"],
    voters: "Graduates, middle-income professionals, Remain voters",
  },
  green: {
    name: "Green",
    color: "#6AB023",
    logo: "/logos/green.svg.png",
    slogan: "Fairer, Greener Future",
    policies: ["Climate action", "Renewable energy", "Social justice"],
    voters: "Young urban progressives, environmentalists",
  },
  reform: {
    name: "Reform UK",
    color: "#12B6CF",
    logo: "/logos/reform.svg.png",
    slogan: "Britain Deserves Better",
    policies: ["Immigration reform", "Cut red tape", "Lower taxes"],
    voters: "Right-leaning, anti-establishment voters",
  },
  snp: {
    name: "SNP",
    color: "#FDF38E",
    logo: "/logos/snp.svg.png",
    slogan: "Stronger for Scotland",
    policies: ["Scottish independence", "Public services", "Progressive tax"],
    voters: "Scottish voters, pro-independence supporters",
  },
  other: {
    name: "Other",
    color: "#888888",
    logo: "/logos/other.png",
    slogan: "Local voices matter",
    policies: ["Regional priorities", "Community issues"],
    voters: "Local and independent party supporters",
  },
};

export function predictParty(answers: Record<string, string>): PredictionOutput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = answers; // placeholder for future use

  const probabilities: Record<Party, number> = {
    lab: 0.25,
    con: 0.25,
    ld: 0.15,
    green: 0.1,
    reform: 0.1,
    snp: 0.1,
    other: 0.05,
  };

  const winner = (Object.keys(probabilities) as Party[]).reduce((a, b) =>
    probabilities[a] > probabilities[b] ? a : b
  );

  return { winner, probabilities };
}