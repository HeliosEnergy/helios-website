// Temporary stub file to satisfy import requirements
// This file provides mock implementations of database functions

export function createMetric(sql, params) {
    console.log('createMetric called with:', params);
    return Promise.resolve({ id: 1, ...params });
}

export function getMetric(sql, params) {
    console.log('getMetric called with:', params);
    return Promise.resolve({ id: params.id, name: 'test', value: 0, timestamp: new Date() });
}

export function listMetrics(sql) {
    console.log('listMetrics called');
    return Promise.resolve([]);
}

export function getMetricsByTimeRange(sql, params) {
    console.log('getMetricsByTimeRange called with:', params);
    return Promise.resolve([]);
}

export function updateMetric(sql, params) {
    console.log('updateMetric called with:', params);
    return Promise.resolve({ id: params.id, ...params });
}

export function deleteMetric(sql, params) {
    console.log('deleteMetric called with:', params);
    return Promise.resolve();
}

export function getMetricsByName(sql, params) {
    console.log('getMetricsByName called with:', params);
    return Promise.resolve([]);
}