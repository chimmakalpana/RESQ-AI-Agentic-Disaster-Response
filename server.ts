import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// CORS configuration for local/preview access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Load resources from backend/app/data/resources.json as single source of truth
const resourcesFilePath = path.join(__dirname, 'backend', 'app', 'data', 'resources.json');
let cachedResources: any[] = [];
try {
  if (fs.existsSync(resourcesFilePath)) {
    cachedResources = JSON.parse(fs.readFileSync(resourcesFilePath, 'utf-8'));
  }
} catch (e) {
  console.warn('Failed reading resources.json, using fallback catalog');
}

// Gemini AI client initialization following the gemini-api skill
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to call Gemini model with automatic fallback if a model experiences 503 high demand
async function callGeminiAgentJson(ai: GoogleGenAI, contents: string, systemInstruction: string): Promise<any> {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      let text = response.text?.trim() || '{}';
      if (text.startsWith('```json')) text = text.slice(7);
      if (text.startsWith('```')) text = text.slice(3);
      if (text.endsWith('```')) text = text.slice(0, -3);

      return JSON.parse(text.trim());
    } catch (err: any) {
      console.warn(`Gemini model ${model} attempt failed:`, err?.status || err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('Gemini API call failed across available models');
}

// Deterministic fallback generator for 100% demo reliability
function generateDeterministicPlan(report: any) {
  const loc = report.location || 'Gajuwaka Industrial & Residential Belt';
  const desc = (report.description || '').toLowerCase();
  const rawType = report.disaster_type || 'Flood';
  const affected = Number(report.affected_people) || 200;
  const vuln = Array.isArray(report.vulnerable_groups) && report.vulnerable_groups.length > 0 
    ? report.vulnerable_groups 
    : ['Children', 'Elderly', 'Injured'];

  let severity = 'High';
  if (desc.includes('critical') || desc.includes('heavy flood') || desc.includes('stranded') || affected >= 150) {
    severity = 'Critical';
  } else if (affected < 50 && vuln.length === 0) {
    severity = 'Medium';
  }

  const detection = {
    disaster_type: rawType,
    severity: severity,
    confidence: 0.96,
    immediate_risks: [
      `Rapid inundation & rising water columns in low-lying zones of ${loc}`,
      'High risk of submerged electrical junctions and domestic grid electrocution',
      'Entrapment of mobility-impaired residents and lack of clean drinking water',
      'Blocked arterial roadways threatening ambulance access and logistics'
    ],
    key_facts: [
      `Reported emergency epicenter: ${loc}`,
      `Estimated affected population count: ${affected} persons`,
      `Verified vulnerable demographics: ${vuln.join(', ')}`,
      'Immediate rescue and heavy watercraft mobilization necessary'
    ]
  };

  const situation = {
    affected_area: `${loc} (High-Risk Inundation Sector 4)`,
    estimated_affected_population: affected,
    vulnerable_groups: vuln,
    priority_zones: [
      `Red Zone Alpha: Residential blocks A & B (Water depth > 4.5 ft, trapped families)`,
      `Amber Zone Beta: Highway 16 underpass and Gajuwaka junction (Transit disruption)`,
      `Green Zone Charlie: High-School elevated playground (Designated triage staging area)`
    ],
    immediate_response_priorities: [
      `Deploy motorized inflatable rescue boats for immediate extraction of ${vuln.join(' and ')}`,
      'Set up mobile medical triage unit at Gajuwaka General Hospital emergency wing',
      'Distribute sterile water tankers and chlorine purification tablets',
      'Establish primary emergency lodging at High School Relief Center',
      'Disconnect power feeders in flooded colony lanes to prevent electrocution'
    ]
  };

  const resources = (cachedResources.length > 0 ? cachedResources : [
    {
      id: 'res-shelter-1',
      type: 'Shelter',
      name: 'Emergency Relief Center A (Gajuwaka High School)',
      location: 'High School Road, Gajuwaka',
      capacity: '450 persons (Available: 320)',
      availability: 'Immediate',
      priority: 'High',
      purpose: 'Primary emergency shelter with dry floor and medical triage room.',
      contact: '+91-891-255-0101',
      is_demo: true
    },
    {
      id: 'res-hospital-1',
      type: 'Hospital',
      name: 'Demo Medical Center (Gajuwaka Area Hospital)',
      location: 'Main Road, Gajuwaka',
      capacity: '120 Emergency Beds (38 ICU beds active)',
      availability: 'Operational - High Surge',
      priority: 'Critical',
      purpose: 'Emergency trauma intake, pediatric treatment, hypothermia management.',
      contact: '+91-891-255-0201',
      is_demo: true
    },
    {
      id: 'res-ambulance-1',
      type: 'Ambulance',
      name: 'Demo Ambulance Unit 1 (ALS Rapid 108)',
      location: 'Staged at Gajuwaka Junction Point Alpha',
      capacity: '2 Critical Patients + 2 Paramedics',
      availability: 'On Standby - Dispatched on alert',
      priority: 'Critical',
      purpose: 'Advanced Life Support transport for injured and elderly evacuees.',
      contact: '108 Dispatcher Net #4',
      is_demo: true
    },
    {
      id: 'res-rescue-1',
      type: 'Rescue Team',
      name: 'Demo Rescue Team Alpha (NDRF 10th BN Water Wing)',
      location: 'Kanithi Road staging area',
      capacity: '18 Specialized Rescuers + 4 Motor Boats',
      availability: 'Deployed in Sector 4',
      priority: 'Critical',
      purpose: 'Evacuation of marooned families, boat rescue in inundated residential zones.',
      contact: '+91-891-255-0301',
      is_demo: true
    },
    {
      id: 'res-food-1',
      type: 'Food',
      name: 'Demo Food Supply Center (Civil Supplies Central Hub)',
      location: 'Warehouse 4, Industrial Area, Gajuwaka',
      capacity: '5,000 Dry Ration & Ready-to-Eat Food Kits',
      availability: 'Ready for Distribution',
      priority: 'Medium',
      purpose: 'Ready-to-eat nutritious meals, clean baby formula, and dry biscuits.',
      contact: '+91-891-255-0401',
      is_demo: true
    },
    {
      id: 'res-water-1',
      type: 'Water',
      name: 'Demo Water Supply Center (Municipal Mobile Water Fleet)',
      location: 'GVMC Water Depot, Near Old Tank',
      capacity: '8 Mobile Tankers (40,000 Liters) + Chlorine Kits',
      availability: 'Dispatched to Relief Points',
      priority: 'High',
      purpose: 'Sterile drinking water tankers, chlorine tablets, and hydration sachets.',
      contact: '+91-891-255-0501',
      is_demo: true
    }
  ]).map((r) => ({ ...r, is_demo: true }));

  const evacuation = {
    recommended_shelter: 'Emergency Relief Center A (Gajuwaka High School)',
    evacuation_priority: 'Immediate',
    suggested_route: 'DEMO ROUTE: Move North along Kanithi Ring Road towards Elevated Flyover, avoiding low-lying storm drain channels, directly into High School Relief Campus.',
    areas_to_avoid: [
      'Low-lying Underpass on Main Railway Bridge (Submerged water depth > 4 feet)',
      'Industrial Drain Canal adjacent to Sector 2 (Hazardous runoff risk)',
      'Unpaved earthen feeder roads near marshland canal (Collapse & slippage hazard)'
    ],
    alternative_route: 'DEMO ALTERNATIVE: Via Old Post Office Bypass -> Elevated NH-16 Service Corridor -> Port Indoor Stadium Shelter.',
    hazard_zone_notes: 'Active water surge observed in Sector 4; rescue boat extraction underway for stranded ground-floor homes.',
    estimated_travel_time: '12 - 20 minutes via designated elevated evacuation corridor'
  };

  const communication = {
    alert_english: `🚨 EMERGENCY ALERT [${severity.toUpperCase()}]: Severe ${rawType} reported in ${loc}. Immediate evacuation underway. Move calmly to Emergency Relief Center A (Gajuwaka High School). Prioritize elderly and children. Avoid flooded roads. Dial 112 / 108 for immediate rescue.`,
    alert_telugu: `🚨 అత్యవసర హెచ్చరిక [${severity.toUpperCase()}]: ${loc} పరిధిలో తీవ్రమైన ${rawType} సంభవించింది. ప్రజలందరూ వెంటనే సురక్షిత ప్రాంతమైన గజువాక హైస్కూల్ రిలీఫ్ సెంటర్ (Emergency Relief Center A) కు తరలివెళ్లండి. వృద్ధులు మరియు పిల్లలకు ముందుగా సహాయం చేయండి. నీరు నిండిన రోడ్లు మరియు విద్యుత్ తీగలకు దూరంగా ఉండండి. అత్యవసర సహాయం కోసం 112 లేదా 108 కు కాల్ చేయండి.`,
    public_instructions: [
      'DO NOT walk, swim, or drive through flowing water or flooded subways.',
      'Turn off main electricity switches and gas valves before leaving premises.',
      'Carry emergency medicines, infant formula, identity documents, and power banks in waterproof bags.',
      'Signal rescue teams from upper floors or rooftops using bright clothes or phone flashlights.',
      'Drink ONLY chlorinated or bottled water provided at the authorized relief counters.'
    ],
    authority_summary: `Incident Commander Brief: ${severity} ${rawType} in ${loc}. ${affected} persons in affected zone. NDRF Team Alpha deploying 4 IRBs. Emergency Shelter A activated. Medical triage standby at Gajuwaka Area Hospital. All municipal channels broadcasting alerts.`,
    broadcast_channels: [
      'Cell Broadcast Emergency Alert System (SMS/CAP)',
      'GVMC Disaster Public Address Sirens (Zone 4)',
      'Local All India Radio & Community FM 98.3 MHz',
      'District Disaster Management Control WhatsApp & Social Feeds'
    ]
  };

  const priority_actions = [
    `Deploy NDRF Water Wing boats to Sector A residential pockets immediately`,
    `Evacuate high-priority vulnerable groups (${vuln.join(', ')}) to Emergency Relief Center A`,
    `Establish advanced medical triage corridor to Gajuwaka General Hospital`,
    `Broadcast bilingual CAP emergency alerts in English and Telugu across all channels`,
    `Dispatch municipal drinking water tankers and power isolation teams to Sector 2`
  ];

  const now = new Date();
  const trace = [
    {
      agent: 'Commander / Orchestrator',
      status: 'completed',
      summary: `Emergency report received for ${loc}. Multi-agent coordination pipeline initiated.`,
      timestamp: new Date(now.getTime() - 4000).toISOString()
    },
    {
      agent: 'Disaster Detection Agent',
      status: 'completed',
      summary: `${rawType} detected with ${severity} severity (Confidence: 96%). Primary hazards classified.`,
      timestamp: new Date(now.getTime() - 3200).toISOString()
    },
    {
      agent: 'Situation Analysis Agent',
      status: 'completed',
      summary: `Analyzed hazard zone: ~${affected} people affected. Identified 3 priority zones and high-risk groups: ${vuln.join(', ')}.`,
      timestamp: new Date(now.getTime() - 2400).toISOString()
    },
    {
      agent: 'Resource Coordination Agent',
      status: 'completed',
      summary: `Matched 6 emergency assets: High-capacity shelter, NDRF water rescue unit, ALS ambulances, medical hospital, food & water tankers.`,
      timestamp: new Date(now.getTime() - 1600).toISOString()
    },
    {
      agent: 'Evacuation Agent',
      status: 'completed',
      summary: `Designated primary route via Kanithi Ring Road to High School Relief Center. Flagged 3 hazardous choke points to avoid.`,
      timestamp: new Date(now.getTime() - 800).toISOString()
    },
    {
      agent: 'Communication Agent',
      status: 'completed',
      summary: `Generated bilingual alerts in English and Telugu, plus 5 tactical public safety directives and authority brief.`,
      timestamp: now.toISOString()
    },
    {
      agent: 'Commander / Orchestrator',
      status: 'completed',
      summary: `Multi-agent outputs combined. Final Emergency Response Plan synthesized and published to command dashboard.`,
      timestamp: new Date(now.getTime() + 100).toISOString()
    }
  ];

  return {
    incident: report,
    detection,
    situation,
    resources,
    evacuation,
    communication,
    priority_actions,
    agent_trace: trace,
    is_fallback: true,
    generated_at: now.toISOString()
  };
}

// Full multi-agent AI execution using Gemini API
async function runGeminiMultiAgentWorkflow(report: any) {
  const ai = getAiClient();
  if (!ai) {
    console.log('No GEMINI_API_KEY configured. Running deterministic fallback.');
    return generateDeterministicPlan(report);
  }

  try {
    const loc = report.location || 'Reported Incident Area';
    const rawType = report.disaster_type || 'Disaster';
    const desc = report.description || 'Emergency incident reported';
    const affected = report.affected_people || 100;
    const vuln = report.vulnerable_groups || [];

    // Agent 1: Detection Agent
    const detectionPrompt = `Analyze emergency incident:
Disaster Type: ${rawType}
Location: ${loc}
Description: ${desc}
Affected Count: ${affected}
Vulnerable Groups: ${vuln.join(', ')}

Return JSON with:
{
  "disaster_type": string,
  "severity": "Low" | "Medium" | "High" | "Critical",
  "confidence": number between 0.8 and 1.0,
  "immediate_risks": string[],
  "key_facts": string[]
}`;

    const detection = await callGeminiAgentJson(
      ai,
      detectionPrompt,
      'You are the Disaster Detection Agent of RESQ-AI. Classify disaster, severity, confidence, immediate risks, and key facts. Return JSON only.'
    );

    // Agent 2: Situation Analysis Agent
    const situationPrompt = `Disaster: ${detection.disaster_type} (${detection.severity})
Location: ${loc}
Description: ${desc}
Key Facts: ${JSON.stringify(detection.key_facts)}
Immediate Risks: ${JSON.stringify(detection.immediate_risks)}

Return JSON with:
{
  "affected_area": string,
  "estimated_affected_population": number,
  "vulnerable_groups": string[],
  "priority_zones": string[],
  "immediate_response_priorities": string[]
}`;

    const situation = await callGeminiAgentJson(
      ai,
      situationPrompt,
      'You are the Situation Analysis Agent of RESQ-AI. Determine affected perimeter, population estimates, vulnerable segments, and immediate response priorities. Return JSON only.'
    );

    // Agent 3: Resource Coordination Agent
    const matchedResources = (cachedResources.length > 0 ? cachedResources : []).map(r => ({
      ...r,
      is_demo: true,
      purpose: `${r.purpose} (Assigned to ${situation.affected_area || loc})`
    }));

    // Agent 4: Evacuation Agent
    const evacuationPrompt = `Situation:
Area: ${situation.affected_area}
Estimated Affected: ${situation.estimated_affected_population}
Vulnerable: ${situation.vulnerable_groups}
Available Shelters: Emergency Relief Center A (Gajuwaka High School), Community Shelter B (Port Indoor Stadium)

Return JSON with:
{
  "recommended_shelter": string,
  "evacuation_priority": "Immediate" | "High" | "Moderate",
  "suggested_route": string,
  "areas_to_avoid": string[],
  "alternative_route": string,
  "hazard_zone_notes": string,
  "estimated_travel_time": string
}`;

    const evacuation = await callGeminiAgentJson(
      ai,
      evacuationPrompt,
      'You are the Evacuation and Route Planning Agent of RESQ-AI. Propose safe evacuation routes, shelter designation, and hazardous zones to avoid. Mark routes as DEMO. Return JSON only.'
    );

    // Agent 5: Communication Agent (English and Telugu)
    const commPrompt = `Disaster: ${detection.disaster_type} (${detection.severity})
Location: ${loc}
Shelter: ${evacuation.recommended_shelter}
Route: ${evacuation.suggested_route}
Avoid: ${evacuation.areas_to_avoid}

Generate:
1. Short public emergency alert in English
2. Short public emergency alert in accurate Telugu (తెలుగు అత్యవసర హెచ్చరిక)
3. Actionable public instructions
4. Emergency authority summary

Return JSON with:
{
  "alert_english": string,
  "alert_telugu": string,
  "public_instructions": string[],
  "authority_summary": string,
  "broadcast_channels": string[]
}`;

    const communication = await callGeminiAgentJson(
      ai,
      commPrompt,
      'You are the Emergency Communication Agent of RESQ-AI. Generate clear, bilingual (English & Telugu) emergency alerts and actionable directives. Return JSON only.'
    );

    const now = new Date();
    const trace = [
      {
        agent: 'Commander / Orchestrator',
        status: 'completed',
        summary: `Incident intake verified for ${loc}. Multi-agent coordination pipeline initiated.`,
        timestamp: new Date(now.getTime() - 4000).toISOString()
      },
      {
        agent: 'Disaster Detection Agent',
        status: 'completed',
        summary: `${detection.disaster_type} detected with ${detection.severity} severity (Confidence: ${Math.round((detection.confidence || 0.95) * 100)}%).`,
        timestamp: new Date(now.getTime() - 3200).toISOString()
      },
      {
        agent: 'Situation Analysis Agent',
        status: 'completed',
        summary: `Mapped affected perimeter: ~${situation.estimated_affected_population} affected. Classified ${situation.priority_zones?.length || 3} hazard zones.`,
        timestamp: new Date(now.getTime() - 2400).toISOString()
      },
      {
        agent: 'Resource Coordination Agent',
        status: 'completed',
        summary: `Coordinated ${matchedResources.length} emergency assets (Shelters, Hospitals, NDRF, ALS Ambulances, Food & Water).`,
        timestamp: new Date(now.getTime() - 1600).toISOString()
      },
      {
        agent: 'Evacuation Agent',
        status: 'completed',
        summary: `Designated safe route to ${evacuation.recommended_shelter}. Flagged ${evacuation.areas_to_avoid?.length || 3} danger zones.`,
        timestamp: new Date(now.getTime() - 800).toISOString()
      },
      {
        agent: 'Communication Agent',
        status: 'completed',
        summary: `Generated bilingual emergency alerts (English & Telugu) and broadcast directives.`,
        timestamp: now.toISOString()
      },
      {
        agent: 'Commander / Orchestrator',
        status: 'completed',
        summary: `Synthesized all agent intelligence into unified Emergency Response Plan.`,
        timestamp: new Date(now.getTime() + 100).toISOString()
      }
    ];

    const priority_actions = [
      `Deploy rescue assets to highest hazard zones in ${loc}`,
      `Prioritize evacuation of ${situation.vulnerable_groups?.join(', ') || 'vulnerable citizens'}`,
      `Establish medical reception corridor to ${evacuation.recommended_shelter}`,
      `Disseminate bilingual emergency alerts across CAP radio & mobile systems`,
      `Maintain continuous surveillance on hazardous bypass roads`
    ];

    return {
      incident: report,
      detection,
      situation,
      resources: matchedResources,
      evacuation,
      communication,
      priority_actions,
      agent_trace: trace,
      is_fallback: false,
      generated_at: now.toISOString()
    };
  } catch (error) {
    console.error('Error during Gemini multi-agent run. Engaging deterministic fallback mode:', error);
    return generateDeterministicPlan(report);
  }
}

// API Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  const client = getAiClient();
  res.json({
    status: 'healthy',
    service: 'RESQ-AI Emergency Coordination System',
    version: '1.0.0',
    mode: client ? 'Gemini Agentic Pipeline Active' : 'Deterministic Demo Fallback Mode',
    agents: [
      'Disaster Detection Agent',
      'Situation Analysis Agent',
      'Resource Coordination Agent',
      'Evacuation Agent',
      'Communication Agent',
      'Commander / Orchestrator'
    ]
  });
});

app.get('/api/resources', (req: Request, res: Response) => {
  res.json({
    resources: cachedResources,
    count: cachedResources.length,
    is_demo: true,
    notice: 'Demo Data — Verify with official authorities before real-world use.'
  });
});

app.post('/api/emergency/analyze', async (req: Request, res: Response) => {
  try {
    const report = req.body;
    if (!report || !report.disaster_type || !report.location) {
      return res.status(400).json({ error: 'Disaster type and location are required.' });
    }

    const plan = await runGeminiMultiAgentWorkflow(report);
    return res.json(plan);
  } catch (err: any) {
    console.error('API Error in /api/emergency/analyze:', err);
    // Even in unexpected top-level error, return safe fallback
    const fallbackPlan = generateDeterministicPlan(req.body || {});
    return res.json(fallbackPlan);
  }
});

// Mount Vite or serve static
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`RESQ-AI server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
