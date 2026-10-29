import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize GoogleGenAI SDK on server-side only
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback logic for when Gemini API key is missing or encounters rate limits/outages
function generateFallbackSolution(problem: {
  title: string;
  category: string;
  description: string;
  location: string;
}) {
  const cat = problem.category.toLowerCase();
  let deptName = 'Campus Facilities & Physical Plant';
  let deptRole = 'Responsible for campus-wide building maintenance, repairs, and infrastructure upkeep.';
  let contact = 'Central Facilities Helpdesk (ext. 4444) or the Campus Work Order Portal.';
  let turnaround = '24 to 48 hours for standard requests; under 2 hours for emergencies.';
  let safety = 'Exercise caution in the affected zone. Alert peers nearby to prevent accidents.';

  if (cat.includes('electric')) {
    deptName = 'Campus Electrical Maintenance & Services';
    deptRole = 'Handles power distribution, breakers, lighting, socket faults, and electrical safety.';
    contact = 'Campus Physical Plant Electrical Emergency Line / Facilities Portal.';
    turnaround = 'Immediate response (1-2 hours) if exposed wiring/sparking; 24 hours for standard fixtures.';
    safety = 'Do NOT touch exposed wiring, sparking switches, or overloaded outlets. Keep liquids away from the area.';
  } else if (cat.includes('water')) {
    deptName = 'Campus Plumbing & Water Utilities';
    deptRole = 'Manages potable water, drainage, leak containment, restroom facilities, and water dispensers.';
    contact = 'Plumbing Dispatch / Campus Facilities Rapid Response.';
    turnaround = 'Under 3 hours for active leaks or flooding; 24 hours for minor drips.';
    safety = 'Slip hazard alert. Avoid stepping in water puddles near electrical equipment or slippery tiles.';
  } else if (cat.includes('clean')) {
    deptName = 'Campus Custodial & Environmental Services';
    deptRole = 'Oversees indoor/outdoor sanitation, trash disposal, biohazard cleanup, and spill response.';
    contact = 'Custodial Services Supervisor Desk / Residence Hall Front Desk.';
    turnaround = 'Within 4-8 hours during normal shift hours.';
    safety = 'Avoid contact with spilled biological or chemical substances. Report any foul odor or slippery residue.';
  } else if (cat.includes('infra')) {
    deptName = 'Campus Facilities, Civil & Structural Engineering';
    deptRole = 'Inspects structural integrity, elevators, walkways, stairs, doors, and classroom fixtures.';
    contact = 'Facilities Operations Management & Building Warden.';
    turnaround = '24-72 hours depending on replacement parts availability.';
    safety = 'Do not force jammed doors or enter non-functioning elevators. Use marked alternate exits.';
  }

  return {
    authority: {
      departmentName: deptName,
      departmentRole: deptRole,
      contactChannel: contact,
      typicalTurnaround: turnaround,
      urgencyLevel: cat.includes('electric') || cat.includes('water') ? 'Urgent (24h)' : 'Standard (2-3 days)'
    },
    actions: [
      {
        priorityNumber: 1,
        priorityLevel: 'Priority 1: Immediate Safety & First Response',
        title: `Secure Location & Notify Nearby Students`,
        actionSteps: `Immediately inspect the immediate perimeter at ${problem.location} from a safe distance. If there is an active safety hazard (spills, exposed wires, broken glass), warn nearby students and place a temporary caution indicator or alert the building proctor/RA immediately.`,
        timeframe: 'Immediate (Within 10-15 minutes)',
        practicalTip: 'Take 2-3 clear, well-lit photos showing both wide context and close-up detail of the defect before leaving the scene.'
      },
      {
        priorityNumber: 2,
        priorityLevel: 'Priority 2: Campus Work Order Escalation',
        title: `Submit Official Ticket to ${deptName}`,
        actionSteps: `Log into your student portal or contact ${deptName} via ${contact}. Submit an official repair request citing the exact location: "${problem.location}". Attach photos and reference any immediate impact on student safety or academic activities.`,
        timeframe: 'Same day (Within 2 hours)',
        practicalTip: 'Keep your ticket reference confirmation number saved on your phone for verification if repairs stall.'
      },
      {
        priorityNumber: 3,
        priorityLevel: 'Priority 3: Student Community Follow-up & Workaround',
        title: `Coordinate Alternative Facilities & Track Resolution`,
        actionSteps: `Inform your class representative, department student council, or dorm floor group chat about the issue so peers know to avoid the spot or use alternative spaces. If unresolved after the stated turnaround (${turnaround}), follow up by forwarding your ticket number to the student ombudsman or building coordinator.`,
        timeframe: '24-48 hours follow-up',
        practicalTip: 'Campus maintenance teams prioritize issues when multiple affected students reference the same work order ticket.'
      }
    ],
    safetyAdvisory: safety,
    campusTicketDraft: {
      subject: `[Campus Maintenance Request] ${problem.category}: ${problem.title} at ${problem.location}`,
      body: `Dear ${deptName} Team,\n\nI am writing to report a campus issue requiring attention.\n\nIssue: ${problem.title}\nCategory: ${problem.category}\nExact Campus Location: ${problem.location}\n\nProblem Details:\n${problem.description}\n\nThis affects student safety and daily campus activities. Please dispatch a technician to inspect and resolve this matter at your earliest convenience.\n\nThank you,\nA Concerned Campus Student`
    },
    source: 'campus-rules-engine' as const
  };
}

// POST endpoint for solving campus problems
app.post('/api/solve-problem', async (req: Request, res: Response) => {
  try {
    const { title, category, description, location } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ error: 'Problem title is required.' });
      return;
    }
    if (!category || typeof category !== 'string' || !category.trim()) {
      res.status(400).json({ error: 'Problem category is required.' });
      return;
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      res.status(400).json({ error: 'Problem description is required.' });
      return;
    }
    if (!location || typeof location !== 'string' || !location.trim()) {
      res.status(400).json({ error: 'Campus location is required.' });
      return;
    }

    const cleanTitle = title.trim();
    const cleanCategory = category.trim();
    const cleanDescription = description.trim();
    const cleanLocation = location.trim();

    // If Gemini client is available, call Gemini API
    if (ai) {
      try {
        const prompt = `You are CampusFix AI, a realistic campus problem solver for college students and staff.
A college student has reported the following campus issue:
- Title: ${cleanTitle}
- Category: ${cleanCategory}
- Campus Location: ${cleanLocation}
- Description: ${cleanDescription}

Analyze this problem and provide:
1. The exact campus department/authority or team that handles this (e.g. Facilities & Grounds, Residence Life Maintenance, Campus Electrical Engineering, Environmental Health & Safety, Custodial Services, Campus Police/Security).
2. Exactly 3 realistic, practical suggested actions ordered strictly by priority:
   - Action 1 (Priority 1): Immediate Safety / Hazard Containment / First Step (What the student/bystanders should do right now).
   - Action 2 (Priority 2): Campus Reporting & Official Escalation (Where and how to submit a formal ticket or contact dispatch).
   - Action 3 (Priority 3): Student Community Follow-up & Practical Workaround (Temporary alternative, peer communication, follow-up timeline).
3. A safety advisory (hazards to avoid, precautions).
4. A formal, courteous ticket/email template draft with subject line and body ready for the student to copy and send to the department.

CRITICAL RULES:
- Do NOT invent or make false claims that the issue has already been fixed or is already resolved.
- Keep advice practical, realistic, professional, and directly tailored to the specific campus setting.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are CampusFix AI. Return realistic, practical, prioritized actions and the responsible campus authority. Never claim that the problem has already been repaired.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                authority: {
                  type: Type.OBJECT,
                  properties: {
                    departmentName: { type: Type.STRING, description: 'Official campus department name' },
                    departmentRole: { type: Type.STRING, description: 'Why this department is responsible' },
                    contactChannel: { type: Type.STRING, description: 'Typical channel or portal to reach them' },
                    typicalTurnaround: { type: Type.STRING, description: 'Realistic estimated resolution/response timeframe' },
                    urgencyLevel: { type: Type.STRING, description: 'Emergency / Immediate, Urgent (24h), Standard (2-3 days), or Routine' }
                  },
                  required: ['departmentName', 'departmentRole', 'contactChannel', 'typicalTurnaround']
                },
                actions: {
                  type: Type.ARRAY,
                  description: 'Exactly three practical actions ordered by priority',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      priorityNumber: { type: Type.INTEGER, description: '1, 2, or 3' },
                      priorityLevel: { type: Type.STRING, description: 'Priority level label' },
                      title: { type: Type.STRING, description: 'Action title' },
                      actionSteps: { type: Type.STRING, description: 'Specific step-by-step instructions' },
                      timeframe: { type: Type.STRING, description: 'Expected urgency or execution timeframe' },
                      practicalTip: { type: Type.STRING, description: 'Helpful student tip or insider advice' }
                    },
                    required: ['priorityNumber', 'priorityLevel', 'title', 'actionSteps', 'timeframe', 'practicalTip']
                  }
                },
                safetyAdvisory: {
                  type: Type.STRING,
                  description: 'Clear safety warnings or hazard precautions'
                },
                campusTicketDraft: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING, description: 'Email/ticket subject' },
                    body: { type: Type.STRING, description: 'Polite formal message body' }
                  },
                  required: ['subject', 'body']
                }
              },
              required: ['authority', 'actions', 'safetyAdvisory', 'campusTicketDraft']
            }
          }
        });

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          res.json({
            problem: {
              id: 'CFX-' + Math.floor(1000 + Math.random() * 9000),
              title: cleanTitle,
              category: cleanCategory,
              description: cleanDescription,
              location: cleanLocation,
              createdAt: new Date().toISOString()
            },
            authority: parsed.authority,
            actions: parsed.actions,
            safetyAdvisory: parsed.safetyAdvisory,
            campusTicketDraft: parsed.campusTicketDraft,
            generatedAt: new Date().toISOString(),
            source: 'gemini-ai'
          });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call warning, falling back to campus rules engine:', geminiError?.message || geminiError);
        // Fallback gracefully below
      }
    }

    // Rules engine fallback (used when GEMINI_API_KEY is not configured or temporary API failure)
    const fallback = generateFallbackSolution({
      title: cleanTitle,
      category: cleanCategory,
      description: cleanDescription,
      location: cleanLocation
    });

    res.json({
      problem: {
        id: 'CFX-' + Math.floor(1000 + Math.random() * 9000),
        title: cleanTitle,
        category: cleanCategory,
        description: cleanDescription,
        location: cleanLocation,
        createdAt: new Date().toISOString()
      },
      authority: fallback.authority,
      actions: fallback.actions,
      safetyAdvisory: fallback.safetyAdvisory,
      campusTicketDraft: fallback.campusTicketDraft,
      generatedAt: new Date().toISOString(),
      source: fallback.source
    });
  } catch (err: any) {
    console.error('Server error handling /api/solve-problem:', err);
    res.status(500).json({
      error: 'An unexpected error occurred while analyzing the campus problem. Please try again.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'CampusFix',
    geminiConfigured: !!apiKey
  });
});

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CampusFix] Server running at http://localhost:${PORT}`);
  });
}

startServer();
