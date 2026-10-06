export type DisasterType = 'Flood' | 'Cyclone' | 'Fire' | 'Earthquake' | 'Landslide' | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type AgentStatus = 'pending' | 'running' | 'completed' | 'error';

export interface EmergencyReportRequest {
  disaster_type: string;
  location: string;
  description: string;
  affected_people: number;
  vulnerable_groups: string[];
  image_data?: string;
}

export interface DetectionResult {
  disaster_type: string;
  severity: SeverityLevel;
  confidence: number;
  immediate_risks: string[];
  key_facts: string[];
}

export interface SituationResult {
  affected_area: string;
  estimated_affected_population: number;
  vulnerable_groups: string[];
  priority_zones: string[];
  immediate_response_priorities: string[];
}

export interface ResourceItem {
  id?: string;
  type: string; // Shelter, Hospital, Ambulance, Rescue Team, Food, Water
  name: string;
  location: string;
  capacity: string;
  availability: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  purpose: string;
  contact?: string;
  is_demo: boolean;
}

export interface EvacuationResult {
  recommended_shelter: string;
  evacuation_priority: string;
  suggested_route: string;
  areas_to_avoid: string[];
  alternative_route: string;
  hazard_zone_notes?: string;
  estimated_travel_time?: string;
}

export interface CommunicationResult {
  alert_english: string;
  alert_telugu: string;
  public_instructions: string[];
  authority_summary: string;
  broadcast_channels?: string[];
}

export interface AgentTraceStep {
  agent: string;
  status: AgentStatus;
  summary: string;
  timestamp?: string;
  details?: Record<string, any>;
}

export interface EmergencyPlanResponse {
  incident: EmergencyReportRequest;
  detection: DetectionResult;
  situation: SituationResult;
  resources: ResourceItem[];
  evacuation: EvacuationResult;
  communication: CommunicationResult;
  priority_actions: string[];
  agent_trace: AgentTraceStep[];
  is_fallback?: boolean;
  generated_at: string;
}
