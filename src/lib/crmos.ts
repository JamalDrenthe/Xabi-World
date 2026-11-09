/**
 * CRMos REST API Client — AI Agent Bi-directionele Ecosysteem Integratie
 * 
 * Volledige REST API-toegang om data op te halen én terug te schrijven in CRMos.
 * Voldoet aan de 4 universele spelregels van het Quantum Initium / CRMos ecosysteem.
 */

export interface CRMosCompanyConfig {
  id: string;
  name: string;
  apiKey: string;
  tag: string;
  domain?: string;
}

export const CRMOS_COMPANIES: Record<string, CRMosCompanyConfig> = {
  xabi_world: {
    id: 'xabi_world',
    name: 'Xabi World',
    apiKey: 'crm_live_xabi_world_international_2026',
    tag: '#xabi-world',
    domain: 'xabi.world',
  },
  all: {
    id: 'all',
    name: 'Alle Bedrijven (Master)',
    apiKey: 'crm_live_master_jamaldrenthe_2026_all_ecosystem',
    tag: '#all',
    domain: 'crmos.one',
  },
  vvc: {
    id: 'vvc',
    name: 'VVC (Verdienende Vrienden Club)',
    apiKey: 'crm_live_vvc_verdienende_vrienden_club_2026',
    tag: '#vvc',
    domain: 'verdienendevrienden.club',
  },
  spontiva: {
    id: 'spontiva',
    name: 'Spontiva',
    apiKey: 'crm_live_spontiva_recruitment_2026',
    tag: '#spontiva',
    domain: 'spontiva.nl',
  },
  boostplug: {
    id: 'boostplug',
    name: 'Boostplug',
    apiKey: 'crm_live_boostplug_energy_iot_2026',
    tag: '#boostplug',
    domain: 'boostplug.one',
  },
  quantum_initium: {
    id: 'quantum_initium',
    name: 'Quantum Initium',
    apiKey: 'crm_live_quantum_initium_enterprise_2026',
    tag: '#quantum-initium',
    domain: 'quantuminitium.com',
  },
  immigratiepunt: {
    id: 'immigratiepunt',
    name: 'Immigratiepunt',
    apiKey: 'crm_live_immigratiepunt_portal_2026',
    tag: '#immigratiepunt',
    domain: 'immigratiepunt.nl',
  },
  woningvry: {
    id: 'woningvry',
    name: 'Woningvry',
    apiKey: 'crm_live_woningvry_realestate_2026',
    tag: '#woningvry',
    domain: 'woningvry.nl',
  },
  djobba_works: {
    id: 'djobba_works',
    name: 'Djobba.works',
    apiKey: 'crm_live_djobba_works_freelance_2026',
    tag: '#djobba-works',
    domain: 'djobba.works',
  },
  trusting_work: {
    id: 'trusting_work',
    name: 'Trusting Work',
    apiKey: 'crm_live_trusting_work_staffing_2026',
    tag: '#trusting-work',
    domain: 'trustingwork.com',
  },
  logs_rent: {
    id: 'logs_rent',
    name: 'Logs.rent',
    apiKey: 'crm_live_logs_rent_logistics_2026',
    tag: '#logs-rent',
    domain: 'logs.rent',
  },
  zheavenzy: {
    id: 'zheavenzy',
    name: 'Zheavenzy',
    apiKey: 'crm_live_zheavenzy_atelier_2026',
    tag: '#zheavenzy',
    domain: 'zheavenzy.com',
  },
  crmos: {
    id: 'crmos',
    name: 'CRMos Platform',
    apiKey: 'crm_live_crmos_core_platform_2026',
    tag: '#crmos',
    domain: 'crmos.one',
  },
};

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
  vvc_tag?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CRMosCandidate {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_applied?: string;
  deal_model?: 'no_cure_no_pay' | string;
  company?: string;
  skills?: string[];
  experience_years?: number;
  location?: string;
  notes?: string;
  tags?: string[];
  status?: string;
  created_at?: string;
}

export interface CRMosDeal {
  id?: string;
  name: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | string;
  company_name?: string;
  contact_id?: string;
  contact_email?: string;
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

export interface CRMosWebhook {
  id?: string;
  company: string;
  url: string;
  events: string[];
  secret: string;
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
const DEFAULT_COMPANY_ID = 'xabi_world';
const OFFLINE_QUEUE_KEY = 'crmos_offline_sync_queue';

class CRMosClient {
  private baseUrl: string;
  private currentCompanyId: string = DEFAULT_COMPANY_ID;
  private customApiKey: string | null = null;

  constructor() {
    this.baseUrl = (import.meta as any).env?.VITE_CRMOS_API_URL || DEFAULT_BASE_URL;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getCompany(): CRMosCompanyConfig {
    return CRMOS_COMPANIES[this.currentCompanyId] || CRMOS_COMPANIES.xabi_world;
  }

  public setCompany(companyId: string) {
    if (CRMOS_COMPANIES[companyId]) {
      this.currentCompanyId = companyId;
      this.customApiKey = null;
    }
  }

  public setApiKey(key: string) {
    this.customApiKey = key;
  }

  public getApiKey(): string {
    if (this.customApiKey) return this.customApiKey;
    const envKey = (import.meta as any).env?.VITE_CRMOS_API_KEY;
    if (envKey) return envKey;
    return this.getCompany().apiKey;
  }

  public getCompanyTag(): string {
    return this.getCompany().tag;
  }

  private getHeaders(): Record<string, string> {
    const key = this.getApiKey();
    return {
      'Content-Type': 'application/json',
      'X-CRMOS-API-KEY': key,
      'Authorization': `Bearer ${key}`,
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
  // SPELREGEL 3: DATA OPHALEN & REALTIME ZOEKEN (GET)
  // ==========================================

  /**
   * Health Check voor statusbots
   * GET /api/v1/health -> {"status": "online"}
   */
  public async checkHealth(): Promise<CRMosApiResponse<{ status: string; timestamp?: string }>> {
    return this.request<{ status: string }>('/health');
  }

  /**
   * Universeel Zoeken: Doorzoekt direct contacten, deals, kandidaten en teams tegelijk
   * GET /api/v1/search?q={zoekterm}
   */
  public async searchUniversal(query: string): Promise<CRMosApiResponse<CRMosSearchResult>> {
    return this.request<CRMosSearchResult>(`/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Specifiek contact controleren op e-mailadres
   * GET /api/v1/contacts?email={email}
   */
  public async getContactByEmail(email: string): Promise<CRMosApiResponse<CRMosContact[]>> {
    return this.request<CRMosContact[]>(`/contacts?email=${encodeURIComponent(email)}`);
  }

  /**
   * VVC Tag verifiëren
   * GET /api/v1/vvc/lookup?tag={tag}
   */
  public async lookupVvcTag(tag: string): Promise<CRMosApiResponse<any>> {
    return this.request<any>(`/vvc/lookup?tag=${encodeURIComponent(tag)}`);
  }

  /**
   * Contacten filteren op zoekterm, company_tag of tag
   * GET /api/v1/contacts?q=...&company_tag=...&tag=...
   */
  public async getContacts(params?: {
    q?: string;
    email?: string;
    company_tag?: string;
    tag?: string;
  }): Promise<CRMosApiResponse<CRMosContact[]>> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.email) searchParams.set('email', params.email);
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
  // SPELREGEL 2: DATA TERUGSCHRIJVEN & VERRIJKEN (POST, PATCH)
  // ==========================================

  /**
   * A. Contact Inschrijven of Slim Verrijken (Upsert)
   * POST /api/v1/contacts/upsert
   * Matcht automatisch op LOWER(TRIM(email)). Voegt tags samen en appends notes met timestamp.
   */
  public async upsertContact(contact: CRMosContact): Promise<CRMosApiResponse<CRMosContact>> {
    // Zorg dat company_tags of tags de actieve bedrijfstag bevatten
    const activeTag = this.getCompanyTag();
    const tags = Array.from(new Set([...(contact.tags || []), activeTag]));
    const company_tags = Array.from(new Set([...(contact.company_tags || []), activeTag]));

    return this.request<CRMosContact>('/contacts/upsert', {
      method: 'POST',
      body: JSON.stringify({
        ...contact,
        tags,
        company_tags,
      }),
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
   * D. Deal / Verkooporder Inschrijven in de Sales Pipeline
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
    const activeTag = this.getCompanyTag();
    const tags = Array.from(new Set([...(candidate.tags || []), activeTag, '#careers']));

    return this.request<CRMosCandidate>('/candidates', {
      method: 'POST',
      body: JSON.stringify({
        ...candidate,
        tags,
      }),
    });
  }

  // ==========================================
  // SPELREGEL 4: WEBHOOKS REGISTREREN (CRMos -> AGENT)
  // ==========================================

  /**
   * Webhook registreren voor realtime status updates (bijv. deal.won, candidate.placed)
   * POST /api/v1/webhooks
   */
  public async registerWebhook(webhook: CRMosWebhook): Promise<CRMosApiResponse<CRMosWebhook>> {
    return this.request<CRMosWebhook>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhook),
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

/**
 * Kant-en-klare promptinstructie voor externe AI agents
 */
export const CRMOS_AGENT_PROMPT_INSTRUCTION = `Instructie voor Externe Agent:
Koppel jouw applicatie rechtstreeks met de centrale CRMos Cloud API via https://crmos.one/api/v1/*
1. Gebruik bij elk request de header X-CRMOS-API-KEY: <JOUW_KEY> en Content-Type: application/json.
2. Test connectiviteit via GET https://crmos.one/api/v1/health.
3. Stuur leads/aanmeldingen altijd via POST https://crmos.one/api/v1/contacts/upsert met minimaal email, first_name, tags (inclusief #jouwbedrijf) en notes. CRMos dedupliceert automatisch op e-mail en voegt tags en notities samen zonder eerdere data te wissen.
4. Stuur vacature-sollicitaties via POST https://crmos.one/api/v1/candidates en deals via POST https://crmos.one/api/v1/deals.
5. CORS en HTTP OPTIONS preflights worden door CRMos direct met 204 No Content geaccepteerd, dus directe calls vanuit webbrowsers werken zonder proxy.`;
