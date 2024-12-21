const colors = {
  background: '#ffffff',
  background_secondary: '#d6dbe1',
  gradient: 'linear-gradient(-135deg, aqua, darkblue)',
  primary: '#065ad7',
  secondary: '#0784C3',
  tertiary: '#1A3D7C',
  text_primary: '#212529',
  text_secondary: '#6C757D',
  button_secondary: '#eee',
  border: '#bababa',
  input_background: '#fafbff',
  valid: '#4caf50',
  error: '#dc2626'
}

const priorityColors = {
  H: { textColor: '#B91C1C', bgColor: '#FCA5A5' }, // High
  M: { textColor: '#F59E0B', bgColor: '#FDE68A' }, // Medium
  L: { textColor: '#16A34A', bgColor: '#BBF7D0' } // Low
}

const statusColors = {
  T: { textColor: '#1E40AF', bgColor: '#93C5FD' }, // Todo
  IP: { textColor: '#D97706', bgColor: '#FDE68A' }, // In Progress
  C: { textColor: '#047857', bgColor: '#A7F3D0' }, // Completed
  E: { textColor: '#4B5563', bgColor: '#D1D5DB' } // Expired
}

export { colors, priorityColors, statusColors }
