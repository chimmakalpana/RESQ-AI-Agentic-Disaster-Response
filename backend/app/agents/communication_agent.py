from typing import Dict, Any, List
from ..services.llm_service import call_llm

COMMUNICATION_SYSTEM_PROMPT = """You are the Emergency Communication Agent for RESQ-AI.
Use the response plan information to generate:
1. Short public emergency alert in English
2. Short public emergency alert in Telugu (తెలుగు అత్యవసర హెచ్చరిక)
3. Detailed public instructions
4. Emergency authority summary

Messages must be:
- Clear
- Short
- Action-oriented
- Easy to understand
Never invent unsupported facts.
Return structured JSON with keys:
{
  "alert_english": "string",
  "alert_telugu": "string",
  "public_instructions": ["instruction 1", "instruction 2", "instruction 3"],
  "authority_summary": "string",
  "broadcast_channels": ["channel 1", "channel 2"]
}"""

def generate_communication(
    report: Dict[str, Any],
    detection: Dict[str, Any],
    situation: Dict[str, Any],
    evacuation: Dict[str, Any]
) -> Dict[str, Any]:
    prompt = f"""Disaster: {detection.get('disaster_type')} ({detection.get('severity')})
Location: {report.get('location')}
Affected: {situation.get('estimated_affected_population')}
Vulnerable: {situation.get('vulnerable_groups')}
Shelter: {evacuation.get('recommended_shelter')}
Route: {evacuation.get('suggested_route')}
Avoid: {evacuation.get('areas_to_avoid')}

Generate bilingual alerts (English and Telugu) and actionable public guidance."""

    llm_res = call_llm(prompt, COMMUNICATION_SYSTEM_PROMPT, expected_json=True)
    if llm_res and "alert_english" in llm_res and "alert_telugu" in llm_res:
        return llm_res

    # Deterministic bilingual fallback
    loc = report.get("location", "Gajuwaka")
    dtype = detection.get("disaster_type", "Flood")
    severity = detection.get("severity", "Critical")
    shelter = evacuation.get("recommended_shelter", "Emergency Relief Center A")

    alert_en = (
        f"🚨 EMERGENCY ALERT [{severity.upper()}]: Severe {dtype} reported in {loc}. "
        f"Immediate evacuation underway. Move calmly to {shelter}. "
        f"Prioritize elderly and children. Stay away from waterlogged wires. Dial 112 / 108 for rescue."
    )

    alert_te = (
        f"🚨 అత్యవసర హెచ్చరిక [{severity.upper()}]: {loc} పరిధిలో తీవ్రమైన {dtype} సంభవించింది. "
        f"ప్రజలందరూ వెంటనే సురక్షిత ప్రాంతమైన {shelter} కు తరలివెళ్లండి. "
        f"వృద్ధులు మరియు పిల్లలకు ముందుగా సహాయం చేయండి. విద్యుత్ తీగలు మరియు లోతట్టు ప్రాంతాలకు దూరంగా ఉండండి. అత్యవసర సహాయం కోసం 112 / 108 కు కాల్ చేయండి."
    )

    instructions = [
        "DO NOT walk or drive through flowing water or flooded subways.",
        "Disconnect main power switches before leaving premises if safe to do so.",
        "Keep mobile phones, medications, identity proofs, and emergency lights in a waterproof pouch.",
        "Signal rescue boats from rooftops using bright cloths or emergency flashlights.",
        "Drink only bottled or boiled water provided at the municipal relief depots."
    ]

    authority_summary = (
        f"Incident Command Brief: {severity} {dtype} in {loc}. {situation.get('estimated_affected_population', 200)} persons impacted. "
        f"NDRF Team Alpha deployed with inflatable boats. Relief shelter activated at {shelter}. "
        f"Medical triage established at Gajuwaka Hospital. All public broadcast channels active."
    )

    return {
        "alert_english": alert_en,
        "alert_telugu": alert_te,
        "public_instructions": instructions,
        "authority_summary": authority_summary,
        "broadcast_channels": [
            "Cell Broadcast Emergency Alert System (SMS/CAP)",
            "GVMC Disaster Public Address Sirens",
            "Local All India Radio & Community FM Stations",
            "District Disaster Management Social Channels & WhatsApp Alerts"
        ]
    }
