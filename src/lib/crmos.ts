/**
 * CRMos REST API Client — AI Agent Bi-directionele Integratie
 * 
 * Volledige integratie voor zowel lezen als realtime terugschrijven in CRMos.
 * Beheert contacten, deals, activiteiten, sollicitanten (No Cure No Pay) en teams.
 */

export interface CRMosContact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  company_tags?: string[];
  tags?: string[];
  notes?: string;
  status?: 'lead' | 'qualified' | 'customer' | 'archived' | string;
  created_at?: string;
  updated_at?: string;
}

export interface CRMosCandidate {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  skills?: string[];
  experience_years?: number;
  location?: string;
  notes?: string;
  status?: string;
  created_at?: string;
}

export interface CRMosDeal {
  id?: string;
  name: string;
  value: number;
  stage: 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'won' | 'lost' | string;
  company_name?: string;
  contact_id?: string;
  probability?: number;
  notes?: string;
  created_at?: string;
}

export interface CRMosActivity {
  id?: string;
  contact_id?: string;
  type: 'call' | 'meeting' | 'email' | 'note' | 'application' | 'partnership' | string;
  title: string;
  description: string;
  performed_by: string;
  created_at?: string;
}

export interface CRMosTeam {
  id: string;
  name: string;
  leader_name?: string;
  members_count?: number;
  tags?: string[];
}

export interface CRMosCompany {
  id: string;
  name: string;
  industry?: string;
  company_tags?: string[];
  contacts_count?: number;
  deals_count?: number;
}

export interface CRMosSearchResult {
  contacts?: CRMosContact[];
  deals?: CRMosDeal[];
  candidates?: CRMosCandidate[];
  teams?: CRMosTeam[];
  companies?: CRMosCompany[];
}

export interface CRMosApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  offlineQueued?: boolean;
}

const DEFAULT_BASE_URL = 'https://crmos.one/api/v1';
const MASTER_API_KEY = 'crm_live_master_jamaldrenthe_2026_all_ecosystem';
const OFFLINE_QUEUE_KEY = 'crmos_offline_sync_queue';

class CRMosClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = (import.meta as any).env?.VITE_CRMOS_API_URL || DEFAULT_BASE_URL;
    this.apiKey = (import.meta as any).env?.VITE_CRMOS_API_KEY || MASTER_API_KEY;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-CRMOS-API-KEY': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Generieke request wrapper met timeout, foutafhandeling en fallback queueing
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CRMosApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        console.warn(`[CRMos API] Error ${response.status} op ${endpoint}:`, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      const errorMessage = isAbort ? 'CRMos request timeout' : (err.message || 'Network error');
      console.warn(`[CRMos API] Request mislukt voor ${endpoint}:`, errorMessage);

      // Als het een schrijfoperatie is (POST, PUT, PATCH), slaan we het op in de offline wachtrij
      if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())) {
        this.enqueueOfflineAction(endpoint, options);
        return {
          success: true,
          offlineQueued: true,
          error: errorMessage,
        };
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private enqueueOfflineAction(endpoint: string, options: RequestInit) {
    try {
      const rawQueue = localStorage.getItem(OFFLINE_QUEUE_KEY);
      const queue = rawQueue ? JSON.parse(rawQueue) : [];
      queue.push({
        endpoint,
        options: {
          method: options.method,
          body: options.body,
        },
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue.slice(-50)));
    } catch {
      // ignore localStorage quota errors
    }
  }

  /**
   * Verwerkt alle acties die opgeslagen zijn tijdens een offline sessie of time-out
   */
  public async syncOfflineQueue(): Promise<number> {
    try {
      const rawQueue = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (!rawQueue) return 0;
      const queue = JSON.parse(rawQueue);
      if (!Array.isArray(queue) || queue.length === 0) return 0;

      let syncedCount = 0;
      const remaining: any[] = [];

      for (const item of queue) {
        try {
          const res = await fetch(`${this.baseUrl}${item.endpoint}`, {
            method: item.options.method,
            headers: this.getHeaders(),
            body: item.options.body,
          });
          if (res.ok) {
            syncedCount++;
          } else {
            remaining.push(item);
          }
        } catch {
          remaining.push(item);
        }
      }

      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
      return syncedCount;
    } catch {
      return 0;
    }
  }

  // ==========================================
  // 1. DATA OPHALEN & REALTIME ZOEKEN (GET)
  // ==========================================

  /**
   * Universeel Zoeken: Doorzoekt direct contacten, deals, kandidaten en teams tegelijk
   * GET /api/v1/search?q={zoekterm}
   */
  public async searchUniversal(query: string): Promise<CRMosApiResponse<CRMosSearchResult>> {
    return this.request<CRMosSearchResult>(`/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Contacten filteren op zoekterm, company_tag of tag
   * GET /api/v1/contacts?q=...&company_tag=...&tag=...
   */
  public async getContacts(params?: {
    q?: string;
    company_tag?: string;
    tag?: string;
  }): Promise<CRMosApiResponse<CRMosContact[]>> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.company_tag) searchParams.set('company_tag', params.company_tag);
    if (params?.tag) searchParams.set('tag', params.tag);

    const query = searchParams.toString();
    return this.request<CRMosContact[]>(`/contacts${query ? `?${query}` : ''}`);
  }

  /**
   * Enkel contact ophalen op ID
   * GET /api/v1/contacts/{id}
   */
  public async getContactById(id: string): Promise<CRMosApiResponse<CRMosContact>> {
    return this.request<CRMosContact>(`/contacts/${encodeURIComponent(id)}`);
  }

  /**
   * Referral Teams & Kernleiders ophalen
   * GET /api/v1/teams
   */
  public async getTeams(): Promise<CRMosApiResponse<CRMosTeam[]>> {
    return this.request<CRMosTeam[]>('/teams');
  }

  /**
   * Bedrijven & Pipelines ophalen
   * GET /api/v1/companies
   */
  public async getCompanies(): Promise<CRMosApiResponse<CRMosCompany[]>> {
    return this.request<CRMosCompany[]>('/companies');
  }

  /**
   * Deals ophalen, optioneel gefilterd op bedrijf
   * GET /api/v1/deals?company={bedrijf}
   */
  public async getDeals(company?: string): Promise<CRMosApiResponse<CRMosDeal[]>> {
    const query = company ? `?company=${encodeURIComponent(company)}` : '';
    return this.request<CRMosDeal[]>(`/deals${query}`);
  }

  /**
   * Sollicitaties & No Cure No Pay profielen ophalen
   * GET /api/v1/candidates
   */
  public async getCandidates(): Promise<CRMosApiResponse<CRMosCandidate[]>> {
    return this.request<CRMosCandidate[]>('/candidates');
  }

  // ==========================================
  // 2. DATA TERUGSCHRIJVEN & VERRIJKEN (POST, PATCH)
  // ==========================================

  /**
   * A. Contact Inschrijven of Slim Verrijken (Upsert)
   * POST /api/v1/contacts/upsert
   * Verrijkt bestaand contact of maakt automatisch een nieuw contact aan
   */
  public async upsertContact(contact: CRMosContact): Promise<CRMosApiResponse<CRMosContact>> {
    return this.request<CRMosContact>('/contacts/upsert', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  /**
   * B. Nieuw Contact Aanmaken
   * POST /api/v1/contacts
   */
  public async createContact(contact: CRMosContact): Promise<CRMosApiResponse<CRMosContact>> {
    return this.request<CRMosContact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  /**
   * C. Bestaand Contact Bijwerken
   * PATCH /api/v1/contacts/{id}
   */
  public async updateContact(
    id: string,
    updates: Partial<CRMosContact>
  ): Promise<CRMosApiResponse<CRMosContact>> {
    return this.request<CRMosContact>(`/contacts/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * D. Deal / Verkoopkans Inschrijven in de Sales Pipeline
   * POST /api/v1/deals
   */
  public async createDeal(deal: CRMosDeal): Promise<CRMosApiResponse<CRMosDeal>> {
    return this.request<CRMosDeal>('/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  /**
   * E. Activiteit / Gespreksnotitie Loggen
   * POST /api/v1/activities
   */
  public async logActivity(activity: CRMosActivity): Promise<CRMosApiResponse<CRMosActivity>> {
    return this.request<CRMosActivity>('/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  /**
   * F. Sollicitant Inschrijven (No Cure No Pay & Vacatures)
   * POST /api/v1/candidates
   */
  public async createCandidate(candidate: CRMosCandidate): Promise<CRMosApiResponse<CRMosCandidate>> {
    return this.request<CRMosCandidate>('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidate),
    });
  }

  /**
   * Hulpmethode: Splitst volledige naam in voornaam en achternaam
   */
  public splitName(fullName: string): { firstName: string; lastName: string } {
    const trimmed = (fullName || '').trim();
    if (!trimmed) return { firstName: '', lastName: '' };
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
  }
}

export const crmos = new CRMosClient();
