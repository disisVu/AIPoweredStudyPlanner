import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

interface PasswordInputProps {
  label: string
  placeholder: string
  value: string
  autocomplete?: string
  onChange: (value: string) => void
  indicator: string
}

export function PasswordInput({
  label,
  value,
  placeholder,
  autocomplete = 'new-password',
  onChange,
  indicator
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='flex w-full flex-col justify-start gap-1.5 text-left'>
      <Label htmlFor={label}>{label}</Label>
      <div className='relative'>
        <Input
          type={showPassword ? 'text' : 'password'}
          id={label}
          placeholder={placeholder}
          value={value}
          autoComplete={autocomplete}
          onChange={(e) => onChange(e.target.value)}
          className='h-12 pr-10'
        />
        <Button
          type='button'
          variant='ghost'
          onClick={togglePasswordVisibility}
          className='absolute right-0 top-1/2 -translate-y-1/2 transform border-none bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none active:bg-transparent'
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </Button>
      </div>
      <span className='h-4 text-xs font-light text-red-600'>{indicator}</span>
    </div>
  )
}
