import { colors } from '@/styles'

interface PasswordComplexityBarProps {
  complexity: number
}

export function PasswordComplexityBar({ complexity }: PasswordComplexityBarProps) {
  const getPercentage = (complexity: number): string => {
    switch (complexity) {
      case 1:
        return '5%' // Very weak
      case 2:
        return '20%' // Weak
      case 3:
        return '40%' // Medium
      case 4:
        return '85%' // Strong
      case 5:
        return '95%' // Very strong
      case 6:
        return '100%' // Excellent
      default:
        return '0%'
    }
  }

  // Determine color based on complexity level
  const getColor = (complexity: number): string => {
    switch (complexity) {
      case 1:
        return '#F4432C' // Red
      case 2:
        return '#F4432C' // Red
      case 3:
        return '#FF6D00' // Orange
      case 4:
        return colors.valid // Green
      case 5:
        return colors.primary // Blue
      case 6:
        return '#7338A0' // Purple
      default:
        return '#eee' // Default gray
    }
  }

  // Determine complexity level label
  const getLabel = (complexity: number): string => {
    switch (complexity) {
      case 1:
        return 'Very weak' // Red
      case 2:
        return 'Weak' // Red
      case 3:
        return 'Medium' // Orange
      case 4:
        return 'Strong' // Green
      case 5:
        return 'Very strong' // Blue
      case 6:
        return 'Excellent' // Purple
      default:
        return '' // Default gray
    }
  }

  return (
    <div className='mt-1 flex w-full flex-col items-start gap-1'>
      {/* Complexity label */}
      <div className='flex w-full justify-start gap-1 text-xs sm:justify-end'>
        <span style={{ color: colors.text_secondary }}>Password strength{complexity > 0 && ':'}</span>
        <span className='text-xs' style={{ color: getColor(complexity) }}>
          {getLabel(complexity)}
        </span>
      </div>
      {/* The bar */}
      <div className='relative w-full rounded-md' style={{ height: '6px', backgroundColor: '#eee' }}>
        <div
          style={{
            width: getPercentage(complexity),
            height: '100%',
            backgroundColor: getColor(complexity),
            position: 'absolute',
            top: '0',
            left: '0',
            borderRadius: '4px',
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </div>
    </div>
  )
}
