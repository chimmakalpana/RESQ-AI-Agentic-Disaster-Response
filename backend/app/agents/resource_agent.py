import json
import os
from pathlib import Path
from typing import Dict, Any, List
from ..services.llm_service import call_llm

DATA_PATH = Path(__file__).parent.parent / "data" / "resources.json"

def load_demo_resources() -> List[Dict[str, Any]]:
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        # Fallback in-memory list
        return [
            {
                "id": "res-shelter-1",
                "type": "Shelter",
                "name": "Emergency Relief Center A (Gajuwaka High School)",
                "location": "High School Road, Gajuwaka",
                "capacity": "450 persons (Available: 320)",
                "availability": "Immediate",
                "priority": "High",
                "purpose": "Primary emergency shelter with dry floor and triage room.",
                "is_demo": True
            },
            {
                "id": "res-hospital-1",
                "type": "Hospital",
                "name": "Demo Medical Center (Gajuwaka Area Hospital)",
                "location": "Main Road, Gajuwaka",
                "capacity": "120 Emergency Beds",
                "availability": "Operational - High Surge",
                "priority": "Critical",
                "purpose": "Trauma care, pediatric stabilization, and emergency surgery.",
                "is_demo": True
            },
            {
                "id": "res-ambulance-1",
                "type": "Ambulance",
                "name": "Demo Ambulance Unit 1 (ALS Rapid 108)",
                "location": "Gajuwaka Junction Point Alpha",
                "capacity": "2 Critical Patients",
                "availability": "On Standby",
                "priority": "Critical",
                "purpose": "Advanced Life Support transport for injured and elderly.",
                "is_demo": True
            },
            {
                "id": "res-rescue-1",
                "type": "Rescue Team",
                "name": "Demo Rescue Team Alpha (NDRF 10th BN Water Wing)",
                "location": "Kanithi Road staging area",
                "capacity": "18 Specialized Rescuers + Boats",
                "availability": "Deployed in Sector 4",
                "priority": "Critical",
                "purpose": "Water extraction of marooned families and elderly.",
                "is_demo": True
            },
            {
                "id": "res-food-1",
                "type": "Food",
                "name": "Demo Food Supply Center",
                "location": "Industrial Warehouse 4",
                "capacity": "5,000 Meal Kits",
                "availability": "Ready for Distribution",
                "priority": "Medium",
                "purpose": "Nutritional food rations and clean baby supplies.",
                "is_demo": True
            },
            {
                "id": "res-water-1",
                "type": "Water",
                "name": "Demo Water Supply Center",
                "location": "Municipal Depot",
                "capacity": "8 Tankers (40,000 Liters)",
                "availability": "Dispatched to Relief Points",
                "priority": "High",
                "purpose": "Safe potable drinking water distribution.",
                "is_demo": True
            }
        ]

def coordinate_resources(report: Dict[str, Any], detection: Dict[str, Any], situation: Dict[str, Any]) -> List[Dict[str, Any]]:
    all_resources = load_demo_resources()
    severity = detection.get("severity", "High")
    vuln = situation.get("vulnerable_groups", [])

    matched: List[Dict[str, Any]] = []
    for r in all_resources:
        item = dict(r)
        item["is_demo"] = True
        
        # Adjust purpose and priority dynamically to the specific emergency
        r_type = item.get("type", "").lower()
        if "rescue" in r_type:
            item["priority"] = "Critical"
            item["purpose"] = f"Urgent rescue operations for {', '.join(vuln) if vuln else 'residents'} in {situation.get('affected_area', 'affected area')}"
        elif "hospital" in r_type:
            item["priority"] = "Critical" if "Injured" in vuln or severity == "Critical" else "High"
            item["purpose"] = f"Emergency intake and treatment for casualties and vulnerable patients."
        elif "ambulance" in r_type:
            item["priority"] = "Critical" if "Injured" in vuln or "Elderly" in vuln else "High"
            item["purpose"] = "Rapid triage and transit of high-risk cases to medical facilities."
        elif "shelter" in r_type:
            item["priority"] = "High"
            item["purpose"] = f"Safe high-ground lodging with sanitation and rations for evacuees."
        elif "water" in r_type or "food" in r_type:
            item["priority"] = "High" if severity in ["High", "Critical"] else "Medium"
            item["purpose"] = "Immediate relief provisions and sterile water packets for evacuees."

        matched.append(item)

    return matched
