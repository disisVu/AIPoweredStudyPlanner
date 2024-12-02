export function getSelectedFields<T>(dto: T): string {
  return Object.keys(dto).join(' ');
}
