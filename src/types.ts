export type ProblemCategory = 'Cleanliness' | 'Infrastructure' | 'Electricity' | 'Water' | 'Other';

export interface ProblemReport {
  id: string;
  title: string;
  category: ProblemCategory;
  description: string;
  location: string;
  createdAt: string;
}

export interface CampusAuthority {
  departmentName: string;
  departmentRole: string;
  contactChannel: string;
  typicalTurnaround: string;
  urgencyLevel?: 'Emergency / Immediate' | 'Urgent (24h)' | 'Standard (2-3 days)' | 'Routine';
}

export interface SuggestedAction {
  priorityNumber: 1 | 2 | 3;
  priorityLevel: string; // e.g., "Priority 1: Immediate / Safety", "Priority 2: Campus Escalation", "Priority 3: Community & Workaround"
  title: string;
  actionSteps: string;
  timeframe: string;
  practicalTip: string;
}

export interface SolutionResponse {
  id?: string;
  problem: ProblemReport;
  authority: CampusAuthority;
  actions: SuggestedAction[];
  safetyAdvisory: string;
  campusTicketDraft: {
    subject: string;
    body: string;
  };
  generatedAt: string;
  source: 'gemini-ai' | 'campus-rules-engine';
}
