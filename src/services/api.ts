import { EmergencyReportRequest, EmergencyPlanResponse, ResourceItem } from '../types';

export const DEMO_SCENARIO_GAJUWAKA: EmergencyReportRequest = {
  disaster_type: 'Flood',
  location: 'Gajuwaka, Visakhapatnam',
  description: 'Heavy flooding has affected a residential area. Several people are stranded and elderly people and children may need immediate assistance.',
  affected_people: 200,
  vulnerable_groups: ['Children', 'Elderly', 'Injured']
};

export const DEMO_SCENARIO_CYCLONE: EmergencyReportRequest = {
  disaster_type: 'Cyclone',
  location: 'Kalingapatnam Coastal Fishermen Colony, AP',
  description: 'Severe cyclonic storm winds exceeding 110 km/h with 2.5m storm surge inundation. Roofs damaged, coastal hamlets isolated without power.',
  affected_people: 450,
  vulnerable_groups: ['Children', 'Elderly', 'Persons with disabilities']
};

export const DEMO_SCENARIO_FIRE: EmergencyReportRequest = {
  disaster_type: 'Fire',
  location: 'Commercial Market District & Complex B',
  description: 'Massive commercial complex fire caused by transformer burst. Dense smoke trapping shoppers and vendors on 2nd and 3rd floors.',
  affected_people: 85,
  vulnerable_groups: ['Injured', 'Elderly', 'Children']
};

export async function analyzeEmergency(report: EmergencyReportRequest): Promise<EmergencyPlanResponse> {
  const response = await fetch('/api/emergency/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    throw new Error(`API analysis failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchResources(): Promise<ResourceItem[]> {
  try {
    const response = await fetch('/api/resources');
    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.status}`);
    }
    const data = await response.json();
    return data.resources || [];
  } catch (err) {
    console.warn('Could not fetch /api/resources, using local fallback list', err);
    return [];
  }
}

export async function checkHealth(): Promise<{ status: string; mode?: string; agents?: string[] }> {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return { status: 'offline' };
    return response.json();
  } catch (err) {
    return { status: 'offline' };
  }
}
