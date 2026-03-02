
export enum ViewType {
  SUMMARY = 'SUMMARY',
  SERVER = 'SERVER',
  SATELLITE = 'SATELLITE',
  GROUND = 'GROUND',
  PRODUCTION = 'PRODUCTION'
}

export interface MetricCardData {
  label: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'source' | 'process' | 'sink';
  status: 'normal' | 'warning' | 'error';
}

export interface WorkflowLink {
  source: string;
  target: string;
  strength: number;
}
