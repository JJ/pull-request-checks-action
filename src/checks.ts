const checklist = /\s*[-*+]\s+\[\s*([xX]?)\s*\]\s+([A-Z]+:)?\s*/gm

export function checks(body: NonNullable<string>): {[id: string]: boolean} {
  // Reset regex state to ensure consistent parsing across multiple calls
  checklist.lastIndex = 0
  const checked: {[id: string]: boolean} = {}
  let match = checklist.exec(body)
  let index = 0
  while (match != null) {
    let key
    if (match[2] !== undefined) {
      key = match[2].replace(':', '')
    } else {
      key = `check${index}`
    }
    checked[key] = match[1] ? true : false
    index++
    match = checklist.exec(body)
  }
  return checked
}
