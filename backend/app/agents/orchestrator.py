import time
from datetime import datetime, timezone
from typing import Dict, Any, List

from .detection_agent import detect_disaster
from .situation_agent import analyze_situation
from .resource_agent import coordinate_resources
from .evacuation_agent import plan_evacuation
from .communication_agent import generate_communication

def run_orchestrator(report_data: Dict[str, Any]) -> Dict[str, Any]:
    trace: List[Dict[str, Any]] = []
    start_time = time.time()

    def add_step(agent: str, status: str, summary: str, details: Dict[str, Any] = None):
        trace.append({
            "agent": agent,
            "status": status,
            "summary": summary,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "details": details or {}
        })

    # Step 1: Orchestrator Activation
    add_step(
        "Commander / Orchestrator",
        "running",
        f"Incident received for {report_data.get('location', 'Reported Area')}. Initializing multi-agent response workflow."
    )

    # Step 2: Disaster Detection Agent
    detection = detect_disaster(report_data)
    add_step(
        "Disaster Detection Agent",
        "completed",
        f"{detection.get('disaster_type')} detected with {detection.get('severity')} severity (Confidence: {int(float(detection.get('confidence', 0.9)) * 100)}%)",
        detection
    )

    # Step 3: Situation Analysis Agent
    situation = analyze_situation(report_data, detection)
    add_step(
        "Situation Analysis Agent",
        "completed",
        f"Analyzed perimeter: ~{situation.get('estimated_affected_population')} people affected. Prioritizing {len(situation.get('vulnerable_groups', []))} vulnerable groups.",
        situation
    )

    # Step 4: Resource Coordination Agent
    resources = coordinate_resources(report_data, detection, situation)
    add_step(
        "Resource Coordination Agent",
        "completed",
        f"Matched {len(resources)} emergency response assets (Shelters, NDRF, ALS Ambulances, Hospital beds, Rations).",
        {"matched_count": len(resources)}
    )

    # Step 5: Evacuation Agent
    evacuation = plan_evacuation(report_data, situation, resources)
    add_step(
        "Evacuation Agent",
        "completed",
        f"Route designated to {evacuation.get('recommended_shelter')}. Identified {len(evacuation.get('areas_to_avoid', []))} high-risk bypass zones.",
        evacuation
    )

    # Step 6: Communication Agent
    communication = generate_communication(report_data, detection, situation, evacuation)
    add_step(
        "Communication Agent",
        "completed",
        "Generated bilingual emergency alerts (English & Telugu) and tactical public advisories.",
        {"channels_count": len(communication.get('broadcast_channels', []))}
    )

    # Step 7: Commander Finalization
    priority_actions = [
        f"Deploy {resources[0]['name'] if resources else 'Rescue Teams'} to Sector A waterlogged zones immediately",
        f"Evacuate high-priority vulnerable groups ({', '.join(situation.get('vulnerable_groups', ['Citizens']))})",
        f"Establish medical triage corridor to {evacuation.get('recommended_shelter')}",
        "Broadcast bilingual CAP emergency alerts via sirens and mobile networks",
        "Commence municipal de-watering and power isolation in Sector 2"
    ]

    add_step(
        "Commander / Orchestrator",
        "completed",
        "All 5 specialized agents concluded execution. Final Emergency Response Plan synthesized and published.",
        {"priority_actions": priority_actions}
    )

    return {
        "incident": report_data,
        "detection": detection,
        "situation": situation,
        "resources": resources,
        "evacuation": evacuation,
        "communication": communication,
        "priority_actions": priority_actions,
        "agent_trace": trace,
        "is_fallback": True, # Marked clearly for demo integrity
        "generated_at": datetime.now(timezone.utc).isoformat()
    }
