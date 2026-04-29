export function decideAction(aiResult: any) {
  const { type, confidence } = aiResult;

  if (confidence < 60) {
    return ['alert']; // low trust
  }

  switch (type) {
    case 'Infra':
      return ['retry', 'alert'];

    case 'Flaky':
      return confidence > 80 ? ['retry'] : ['quarantine'];

    case 'API':
      return ['alert', 'ticket'];

    case 'Data Issue':
      return ['alert', 'block-release'];

    default:
      return ['alert'];
  }
}