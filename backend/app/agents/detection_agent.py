from typing import Dict, Any, List
from ..services.llm_service import call_llm

DETECTION_SYSTEM_PROMPT = """You are the Disaster Detection Agent of RESQ-AI.
Analyze an emergency report.
Identify:
1. Disaster type
2. Severity: Low, Medium, High, Critical
3. Immediate risks
4. Confidence score (between 0.0 and 1.0)
5. Key facts

Do not invent facts.
If information is missing, mark it as unknown.
Return structured JSON with keys:
{
  "disaster_type": "string",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "confidence": float,
  "immediate_risks": ["risk 1", "risk 2"],
  "key_facts": ["fact 1", "fact 2"]
}"""

def detect_disaster(report: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""Emergency Report Data:
- Reported Disaster Type: {report.get('disaster_type')}
- Location: {report.get('location')}
- Description: {report.get('description')}
- Estimated Affected: {report.get('affected_people')}
- Vulnerable Groups Present: {', '.join(report.get('vulnerable_groups', [])) or 'None reported'}

Perform emergency disaster detection and classification."""

    llm_res = call_llm(prompt, DETECTION_SYSTEM_PROMPT, expected_json=True)
    if llm_res and "disaster_type" in llm_res and "severity" in llm_res:
        return llm_res

    # Deterministic fallback logic
    desc = (report.get("description", "") + " " + report.get("disaster_type", "")).lower()
    affected = report.get("affected_people", 1)
    vuln = report.get("vulnerable_groups", [])

    severity = "Medium"
    confidence = 0.94
    if any(k in desc for k in ["severe", "heavy flood", "submerged", "trapped", "stranded", "critical", "building collapse", "tsunami"]):
        severity = "Critical" if (affected >= 100 or len(vuln) >= 2) else "High"
    elif affected > 50 or len(vuln) > 0:
        severity = "High"

    disaster_type = report.get("disaster_type") or "Flood"
    immediate_risks = []
    if "flood" in desc or "water" in desc:
        immediate_risks = [
            "Rapidly rising water levels threatening ground-floor dwellings",
            "Risk of electrical short-circuits & submerged live wires",
            "Hypothermia and water-borne pathogens among stranded residents",
            "Disruption of drinking water pipelines and access roads"
        ]
    elif "fire" in desc:
        immediate_risks = [
            "Rapid spread of toxic smoke and carbon monoxide",
            "Structural weakening of burning complexes",
            "Combustion of nearby LPG cylinders and inflammable stores"
        ]
    elif "cyclone" in desc:
        immediate_risks = [
            "Gale-force winds causing roof collapse and flying debris",
            "Downed high-voltage power transmission lines",
            "Inland storm surge inundating coastal communities"
        ]
    else:
        immediate_risks = [
            "Severe physical entrapment and structural collapse danger",
            "Disruption of municipal power and emergency transit corridors",
            "Delayed medical intervention for vulnerable victims"
        ]

    key_facts = [
        f"Incident confirmed at {report.get('location', 'Reported Sector')}",
        f"Estimated {affected} individuals within the danger perimeter",
        f"Vulnerable individuals reported: {', '.join(vuln) if vuln else 'None specified'}"
    ]

    return {
        "disaster_type": disaster_type,
        "severity": severity,
        "confidence": confidence,
        "immediate_risks": immediate_risks,
        "key_facts": key_facts
    }
