import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = '' }: SearchBarProps) {
  return (
    <div className='flex w-full items-center justify-between gap-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium outline-1 outline-indigo-500 hover:outline'>
      <FontAwesomeIcon icon={faSearch} className='text-gray-500' />
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='w-full focus:outline-none'
      />
    </div>
  )
}
