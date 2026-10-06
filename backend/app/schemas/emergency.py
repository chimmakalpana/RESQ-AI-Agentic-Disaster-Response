from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EmergencyReportRequest(BaseModel):
    disaster_type: str = Field(..., description="Type of disaster, e.g. Flood, Cyclone, Fire, Earthquake, Landslide, Other")
    location: str = Field(..., description="Affected location/neighborhood/city")
    description: str = Field(..., description="Detailed description of the emergency")
    affected_people: int = Field(default=1, ge=1, description="Estimated number of people affected")
    vulnerable_groups: List[str] = Field(default_factory=list, description="Vulnerable groups e.g. Children, Elderly, Injured, Persons with disabilities")
    image_data: Optional[str] = Field(default=None, description="Optional base64 image data")

class DetectionResult(BaseModel):
    disaster_type: str
    severity: str  # Low, Medium, High, Critical
    confidence: float
    immediate_risks: List[str]
    key_facts: List[str]

class SituationResult(BaseModel):
    affected_area: str
    estimated_affected_population: int
    vulnerable_groups: List[str]
    priority_zones: List[str]
    immediate_response_priorities: List[str]

class ResourceItem(BaseModel):
    id: Optional[str] = None
    type: str  # Shelter, Hospital, Ambulance, Rescue Team, Food, Water
    name: str
    location: str
    capacity: str
    availability: str
    priority: str  # Critical, High, Medium, Low
    purpose: str
    contact: Optional[str] = None
    is_demo: bool = True

class EvacuationResult(BaseModel):
    recommended_shelter: str
    evacuation_priority: str
    suggested_route: str
    areas_to_avoid: List[str]
    alternative_route: str
    hazard_zone_notes: Optional[str] = None
    estimated_travel_time: Optional[str] = None

class CommunicationResult(BaseModel):
    alert_english: str
    alert_telugu: str
    public_instructions: List[str]
    authority_summary: str
    broadcast_channels: Optional[List[str]] = None

class AgentTraceStep(BaseModel):
    agent: str
    status: str  # pending, running, completed, error
    summary: str
    timestamp: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class EmergencyPlanResponse(BaseModel):
    incident: EmergencyReportRequest
    detection: DetectionResult
    situation: SituationResult
    resources: List[ResourceItem]
    evacuation: EvacuationResult
    communication: CommunicationResult
    priority_actions: List[str]
    agent_trace: List[AgentTraceStep]
    is_fallback: bool = False
    generated_at: str
