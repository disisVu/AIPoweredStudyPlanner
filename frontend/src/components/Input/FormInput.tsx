import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FromInputProps {
  label: string
  type: string
  placeholder: string
  value: string
  autocomplete?: string
  onChange: (value: string) => void
  indicator: string
}

export function FormInput({
  value,
  type,
  label,
  placeholder,
  autocomplete = 'off',
  onChange,
  indicator
}: FromInputProps) {
  return (
    <div className='flex w-full flex-col justify-start gap-1.5 text-left'>
      <Label htmlFor={label}>{label}</Label>
      <Input
        type={type}
        id={label}
        placeholder={placeholder}
        value={value}
        autoComplete={autocomplete}
        onChange={(e) => onChange(e.target.value)}
        className='h-12'
      />
      <span className='h-4 text-xs font-light text-red-600'>{indicator}</span>
    </div>
  )
}
