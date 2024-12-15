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

function hexToRgb(hex: string) {
  // Ensure the hex is valid
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error('Invalid hex color')
  }

  // Remove the '#' and parse RGB components
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return { r, g, b }
}

function getLuminance(r: number, g: number, b: number) {
  // Normalize RGB values to the range 0-1
  const normalize = (x: number) => {
    const c = x / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }

  // Apply luminance formula
  const R = normalize(r)
  const G = normalize(g)
  const B = normalize(b)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function getTextColorForBackground(hexColor: string) {
  const { r, g, b } = hexToRgb(hexColor)
  const luminance = getLuminance(r, g, b)
  return luminance > 0.5 ? 'black' : 'white'
}
