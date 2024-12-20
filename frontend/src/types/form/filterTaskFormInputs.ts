export interface filterTaskFormInputs {
  name: string
  priority: '' | 'H' | 'M' | 'L'
  status: '' | 'T' | 'IP' | 'C' | 'E'
  deadline: Date
}
