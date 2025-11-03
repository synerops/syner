export function checkHealth() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'syner'
  };
}
