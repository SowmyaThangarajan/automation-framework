export function decideAction(aiResult: any) {
  if (aiResult.type === 'Infra') return ['retry', 'alert'];
  if (aiResult.type === 'Flaky') return ['retry'];
  if (aiResult.type === 'Data Issue') return ['alert', 'ticket'];
  return ['alert'];
}