// Type definitions for the database query functions

export interface Metric {
  id: number;
  name: string;
  value: number;
  timestamp: Date;
}

export interface CreateMetricParams {
  name: string;
  value: number;
  timestamp?: Date | null;
}

export interface GetMetricParams {
  id: number;
}

export interface UpdateMetricParams {
  id: number;
  name: string;
  value: number;
  timestamp?: Date | null;
}

export interface GetMetricsByNameParams {
  name: string;
}

export interface GetMetricsByTimeRangeParams {
  start_timestamp: Date;
  end_timestamp: Date;
}

export declare function createMetric(sql: any, params: CreateMetricParams): Promise<Metric>;
export declare function getMetric(sql: any, params: GetMetricParams): Promise<Metric | null>;
export declare function listMetrics(sql: any): Promise<Metric[]>;
export declare function getMetricsByTimeRange(sql: any, params: GetMetricsByTimeRangeParams): Promise<Metric[]>;
export declare function updateMetric(sql: any, params: UpdateMetricParams): Promise<Metric>;
export declare function deleteMetric(sql: any, params: GetMetricParams): Promise<void>;
export declare function getMetricsByName(sql: any, params: GetMetricsByNameParams): Promise<Metric[]>;