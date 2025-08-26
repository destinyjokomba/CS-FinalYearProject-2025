import React from "react";

type Prediction = {
  party: string;
  confidence: number;
  runnerUp?: string;
};

interface PartyCardProps {
  prediction: Prediction;
}

const partyMeta: Record<string, { color: string; ethos: string[]; slogan: string }> = {
  lab: { color: "#E4003B", ethos: ["Workers' rights", "Public services", "Equality"], slogan: "For the many, not the few" },
  con: { color: "#0087DC", ethos: ["Strong economy", "Free markets", "Personal responsibility"], slogan: "Build a better future" },
  ld: { color: "#FDBB30", ethos: ["Civil liberties", "Environment", "Education"], slogan: "Open, tolerant, united" },
  green: { color: "#6AB023", ethos: ["Climate action", "Equality", "Fairer, greener future"], slogan: "Fairer, greener future" },
  reform: { color: "#00BFFF", ethos: ["Tax cuts", "Sovereignty", "Border control"], slogan: "Britain first, always" },
  snp: { color: "#FFD500", ethos: ["Independence", "Social justice", "Green energy"], slogan: "Stronger for Scotland" },
  other: { color: "#A0AEC0", ethos: [], slogan: "Independent representation" },
};

const PartyCard: React.FC<PartyCardProps> = ({ prediction }) => {
  const meta = partyMeta[prediction.party] || partyMeta["other"];

  return (
    <div className="p-6 rounded-2xl shadow-lg text-white" style={{ backgroundColor: meta.color }}>
      <h2 className="text-xl font-bold capitalize">{prediction.party}</h2>
      <p className="italic">{meta.slogan}</p>

      <ul className="mt-3 space-y-1 text-sm">
        {meta.ethos.map((eth, idx) => (
          <li key={idx}>✔ {eth}</li>
        ))}
      </ul>

      <div className="mt-4 text-lg font-semibold">
        Confidence: {prediction.confidence}% <br />
        Runner-up: {prediction.runnerUp || "N/A"}
      </div>
    </div>
  );
};

export default PartyCard;
