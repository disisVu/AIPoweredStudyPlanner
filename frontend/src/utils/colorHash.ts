function fnv1aHash(str: string) {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return hash
}

export function stringToColor(str: string) {
  const hash = fnv1aHash(str)

  const r = (hash >> 16) & 0xff
  const g = (hash >> 8) & 0xff
  const b = hash & 0xff

  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}
