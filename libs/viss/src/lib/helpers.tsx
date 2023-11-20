//

export function scoreToImpact(score: number) {
  return [
    { min: 0, max: 9, impact: 'None' },
    { min: 9.01, max: 39, impact: 'Low' },
    { min: 39.01, max: 69, impact: 'Medium' },
    { min: 69.01, max: 89, impact: 'High' },
    { min: 89.01, max: 100, impact: 'Critical' }
  ].find((range) => {
    return score >= range.min && score <= range.max
  })?.impact || ''
}

export function fromVectorString(vectorString: string) {
  const match = vectorString.match(/^#VISS:([\d\.]+|U):?(;T:\d+\/I:\d+\/D:\d+;)?(.*)/);

  let selection: {[metric: string]: string} = {}
  
  if (match?.length === 4) {
    const [version, magnitudes, pairs] = [match[1], match[2], match[3]];
    
    pairs?.split('/').forEach((pair: string) => {
      const [key, value] = pair.split(':')
      selection = Object.assign(selection, {[key]: value});
    })

    return {
      version,
      magnitudes,
      selection
    }
  }

  return {
    version: 0,
    magnitudes: '',
    selection: {}
  }
}

export function toVectorString(selectionList: {[metric: string]: string | undefined}, version?: string | null) {
  const pairs: string[] = [];

  Object.entries(selectionList).forEach(([metric, value]) => {
    pairs.push(`${metric}:${value ? value : ''}`)
  })

  return pairs.length > 0 ? `VISS:${version ? version : ''}:${pairs.join('/')}` : '';
}

export function toPrintableVersion(version: number | string | undefined): string {
  if (!version) {
    return '';
  }

  return String(Number(version) / 100);
}