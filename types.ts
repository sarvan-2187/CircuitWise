export interface ComponentItem {
  type: string;
  count: number;
}

export interface ICItem {
  type: string;
  pins: string[];
}

export interface Connection {
  from: string;
  to: string;
}

export interface WireCount {
  total_circuit_connections: number;
  total_power_connections: number;
  overall_total: number;
}

export interface AnalysisResult {
  components: ComponentItem[];
  ics: { [key: string]: ICItem };
  pin_connections: Connection[];
  wire_count: WireCount;
  assumptions: string[];
}
