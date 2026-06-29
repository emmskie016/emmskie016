export type Platform = 'meta' | 'google'

export type CampaignStatus = 'active' | 'paused' | 'review' | 'draft' | 'limited'

export type Objective =
  | 'Sales / Conversions'
  | 'Leads'
  | 'Traffic'
  | 'Awareness'
  | 'App installs'

export interface Campaign {
  id: string
  name: string
  platform: Platform
  status: CampaignStatus
  objective: Objective
  budget: number // daily
  spend: number
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  roas: number
  cpa: number
  ctr: number
  autopilot: boolean
}

export interface Kpi {
  label: string
  value: string
  delta: number // % change vs previous period
  spark: number[]
}

export interface SeriesPoint {
  date: string
  meta: number
  google: number
}

export type RuleStatus = 'enabled' | 'paused'

export interface AutomationRule {
  id: string
  name: string
  platform: Platform | 'all'
  trigger: string
  condition: string
  action: string
  status: RuleStatus
  runs: number
  lastRun: string
  requiresApproval: boolean
}

export interface CreativeAsset {
  id: string
  headline: string
  body: string
  cta: string
  platform: Platform
  format: string
  status: 'draft' | 'in_review' | 'live' | 'winning'
  ctr: number
  hue: number
}

export interface Connection {
  platform: Platform
  account: string
  accountId: string
  status: 'connected' | 'action_required' | 'disconnected'
  spend30d: number
  issues: number
}

export interface ActivityItem {
  id: string
  time: string
  actor: 'autopilot' | 'rule' | 'user'
  text: string
  reason?: string
  platform: Platform
}
