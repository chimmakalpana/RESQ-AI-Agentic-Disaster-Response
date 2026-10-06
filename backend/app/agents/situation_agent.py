from typing import Dict, Any, List
from ..services.llm_service import call_llm

SITUATION_SYSTEM_PROMPT = """You are the Situation Analysis Agent for RESQ-AI.
Analyze the output from the Disaster Detection Agent and the original emergency report.
Determine:
1. Affected area
2. Estimated affected population
3. Vulnerable groups
4. Priority zones
5. Immediate response priorities

Clearly mark estimates.
Never invent unsupported facts.
Return structured JSON with keys:
{
  "affected_area": "string",
  "estimated_affected_population": int,
  "vulnerable_groups": ["group 1", "group 2"],
  "priority_zones": ["zone 1", "zone 2"],
  "immediate_response_priorities": ["priority 1", "priority 2", "priority 3"]
}"""

def analyze_situation(report: Dict[str, Any], detection: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""Disaster Report:
- Location: {report.get('location')}
- Reported count: {report.get('affected_people')}
- Vulnerable reported: {report.get('vulnerable_groups')}
- Description: {report.get('description')}

Disaster Detection Output:
- Disaster Type: {detection.get('disaster_type')}
- Severity: {detection.get('severity')}
- Key Facts: {detection.get('key_facts')}
- Immediate Risks: {detection.get('immediate_risks')}

Produce complete situation analysis and prioritize zones."""

    llm_res = call_llm(prompt, SITUATION_SYSTEM_PROMPT, expected_json=True)
    if llm_res and "affected_area" in llm_res and "immediate_response_priorities" in llm_res:
        return llm_res

    # Deterministic fallback logic
    loc = report.get("location") or "Gajuwaka Industrial & Residential Cluster"
    affected = int(report.get("affected_people", 200))
    vuln = report.get("vulnerable_groups") or ["Children", "Elderly", "Injured"]

    priority_zones = [
        f"Sector A: Low-lying residential pockets in {loc} (Flooded / Direct hazard)",
        f"Sector B: Main junction & arterial access roads (Transit choke points)",
        f"Sector C: Peripheral safe perimeter (Assembly & Staging points)"
    ]

    immediate_priorities = [
        f"Conduct immediate water-rescue & extraction of stranded {', '.join(vuln)}",
        "Deploy inflatable rescue craft and high-clearance emergency transport",
        "Establish field medical triage and transfer injured to Demo Medical Center",
        "Mobilize drinking water tankers and dry rations to relief shelters",
        "Isolate electrical substation grid in submerged residential sectors"
    ]

    return {
        "affected_area": f"{loc} (Zone 4 Perimeter)",
        "estimated_affected_population": affected,
        "vulnerable_groups": vuln,
        "priority_zones": priority_zones,
        "immediate_response_priorities": immediate_priorities
    }
