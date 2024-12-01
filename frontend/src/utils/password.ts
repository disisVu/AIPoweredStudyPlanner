export function computePasswordComplexity(password: string): number {
  // Initialize complexity score
  let complexity = 0
  // Check password length
  if (password.length >= 8) {
    complexity++
  }
  if (password.length >= 12) {
    complexity++
  }
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    complexity++
  }
  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    complexity++
  }
  // Check for digits
  if (/\d/.test(password)) {
    complexity++
  }
  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    complexity++
  }
  return complexity
}
