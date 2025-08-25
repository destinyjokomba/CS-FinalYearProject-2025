from flask import Blueprint, jsonify


party_meta_bp = Blueprint("party_meta", __name__, url_prefix="/api")

@party_meta_bp.route("/partyMeta", methods=["GET"])
def get_party_meta():
    parties = {
        "labour": {
            "color": "#E4003B",
            "logo": "/logos/labour.png",
            "ethos": ["Workers' rights", "Public services", "Equality"],
            "slogan": "For the many, not the few",
        },
        "conservative": {
            "color": "#0087DC",
            "logo": "/logos/conservative.svg.png",
            "ethos": ["Strong economy", "Free markets", "Personal responsibility"],
            "slogan": "Build a better future",
        },
        "libdem": {
            "color": "#FDBB30",
            "logo": "/logos/libdem.png",
            "ethos": ["Civil liberties", "Environment", "Education"],
            "slogan": "Open, tolerant, united",
        },
        "green": {
            "color": "#6AB023",
            "logo": "/logos/green.svg.png",
            "ethos": ["Climate action", "Sustainability", "Equality"],
            "slogan": "Fairer, greener future",
        },
        "reform": {
            "color": "#00BFFF",
            "logo": "/logos/reform.svg.png",
            "ethos": ["Tax cuts", "National sovereignty", "Border control"],
            "slogan": "Britain first, always",
        },
        "snp": {
            "color": "#FFF95D",
            "logo": "/logos/snp.svg.png",
            "ethos": ["Scottish independence", "Social justice", "Green energy"],
            "slogan": "Stronger for Scotland",
        },
    }
    print("✅ Serving party metadata:", list(parties.keys()))
    return jsonify(parties)
