from typing import Dict, Any, List
from ..services.llm_service import call_llm

EVACUATION_SYSTEM_PROMPT = """You are the Evacuation and Route Planning Agent.
Create a safe evacuation plan based on the available situation and resource information.
Determine:
1. Recommended shelter
2. Evacuation priority (Immediate, High, Moderate)
3. Suggested route
4. Areas to avoid if information is available
5. Alternative route if available

Never claim that a route is live or verified unless live data is provided.
Mark simulated routes as DEMO routes.
Return structured JSON with keys:
{
  "recommended_shelter": "string",
  "evacuation_priority": "Immediate" | "High" | "Moderate",
  "suggested_route": "string",
  "areas_to_avoid": ["area 1", "area 2"],
  "alternative_route": "string",
  "hazard_zone_notes": "string",
  "estimated_travel_time": "string"
}"""

def plan_evacuation(report: Dict[str, Any], situation: Dict[str, Any], resources: List[Dict[str, Any]]) -> Dict[str, Any]:
    prompt = f"""Situation:
- Affected Area: {situation.get('affected_area')}
- Estimated Population: {situation.get('estimated_affected_population')}
- Vulnerable Groups: {situation.get('vulnerable_groups')}
- Available Shelters: {[r['name'] for r in resources if r.get('type') == 'Shelter']}

Generate a safe simulated evacuation corridor and danger zone avoidances."""

    llm_res = call_llm(prompt, EVACUATION_SYSTEM_PROMPT, expected_json=True)
    if llm_res and "recommended_shelter" in llm_res and "suggested_route" in llm_res:
        return llm_res

    # Deterministic fallback logic
    loc = report.get("location", "Gajuwaka")
    shelter = "Emergency Relief Center A (Gajuwaka High School Relief Center)"
    for r in resources:
        if r.get("type") == "Shelter":
            shelter = r.get("name", shelter)
            break

    return {
        "recommended_shelter": shelter,
        "evacuation_priority": "Immediate",
        "suggested_route": f"DEMO ROUTE: Move North along Kanithi Ring Road towards Elevated Flyover, avoiding low-lying storm drain channels, directly into High School Relief Campus.",
        "areas_to_avoid": [
            "Low-lying Underpass on Main Railway Bridge (Submerged water depth > 4 feet)",
            "Industrial Drain Corridor adjacent to Sector 2 (Hazardous runoff risk)",
            "Unpaved earthen feeder roads near marshland canal (Collapse & slippage hazard)"
        ],
        "alternative_route": f"DEMO ALTERNATIVE: Via Old Post Office Bypass -> Elevated NH-16 Service Corridor -> Port Indoor Stadium Shelter.",
        "hazard_zone_notes": "Active flood runoffs observed in Sector 4; utilize elevated walkways and rescue team motor dinghies for immobile victims.",
        "estimated_travel_time": "15 - 25 mins by emergency boat / elevated vehicle"
    }
