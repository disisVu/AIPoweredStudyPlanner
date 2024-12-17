import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { PasswordComplexityBar } from '@/components/Bar'
import { ButtonFullWidth } from '@/components/Button'
import { FormInput, PasswordInput } from '@/components/Input'
import { PrimaryModal } from '@/components/Modal/ModalLayouts'
import { colors } from '@/styles'
import { computePasswordComplexity, emailRegex } from '@/utils'
import { RegistrationFormInputs } from '@/types/form'
import { useToast } from '@/hooks/use-toast'

export function RegistrationModal() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    watch,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm<RegistrationFormInputs>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const passwordValue = watch('password')

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data: RegistrationFormInputs) => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Registration successfully.',
          description: 'Proceeding to Login Form.'
        })
        navigateToLogin()
      } else {
        toast({
          title: 'Registration failed.',
          description: result.message
        })
      }
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: 'An error occured during registration.'
      })
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToLogin = () => {
    navigate('/auth/login')
  }

  return (
    <PrimaryModal isOpen={true}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='flex w-full flex-col gap-10'>
          <div className='flex w-full flex-col items-start gap-1'>
            <span style={{ color: colors.text_primary }} className='text-3xl font-bold'>
              Registration
            </span>
            <span style={{ color: colors.text_secondary }} className='text-sm'>
              Create an account
            </span>
          </div>
          <div className='flex w-full flex-col items-start gap-7'>
            {/* Input username */}
            <Controller
              name='username'
              control={control}
              rules={{
                required: 'Required',
                minLength: { value: 3, message: 'Must contain at least 3 characters.' }
              }}
              render={({ field: { value, onChange } }) => (
                <FormInput
                  label='Username'
                  type='text'
                  placeholder='Enter username here'
                  value={value}
                  autocomplete='username'
                  onChange={onChange}
                  indicator={errors.username ? errors.username.message || '' : ''}
                />
              )}
            />
            {/* Input new email */}
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Required',
                pattern: { value: emailRegex, message: 'Invalid email format.' }
              }}
              render={({ field: { value, onChange } }) => (
                <FormInput
                  label='Email'
                  type='email'
                  placeholder='Enter email here'
                  value={value}
                  autocomplete='email'
                  onChange={onChange}
                  indicator={errors.email ? errors.email.message || '' : ''}
                />
              )}
            />
            {/* Input new password */}
            <div className='relative mb-2 w-full'>
              <Controller
                name='password'
                control={control}
                rules={{
                  required: 'Required',
                  minLength: { value: 8, message: 'Must contain at least 8 characters.' },
                  validate: {
                    complexity: (value) => {
                      const complexity = computePasswordComplexity(value)
                      if (complexity < 3) {
                        return 'Password is too weak.'
                      }
                      return true
                    }
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <PasswordInput
                      label='Password'
                      placeholder='Enter password here'
                      value={value}
                      onChange={(val: string) => {
                        onChange(val)
                        trigger('password')
                      }}
                      indicator={errors.password ? errors.password.message || '' : ''}
                    />
                    <div style={{ bottom: '-10px' }} className='w-full sm:absolute'>
                      <PasswordComplexityBar complexity={computePasswordComplexity(value)} />
                    </div>
                  </>
                )}
              />
            </div>
            {/* Confirm password */}
            <Controller
              name='confirmPassword'
              control={control}
              rules={{
                required: 'Required',
                validate: (value) => value === passwordValue || 'Confirm password must match.'
              }}
              render={({ field: { value, onChange } }) => (
                <PasswordInput
                  label='Confirm password'
                  placeholder='Re-enter password'
                  value={value}
                  onChange={(val: string) => {
                    onChange(val)
                    trigger('confirmPassword')
                  }}
                  indicator={errors.confirmPassword ? errors.confirmPassword.message || '' : ''}
                />
              )}
            />
          </div>
          <div className='flex w-full flex-col items-center gap-5'>
            <ButtonFullWidth enabled={true} text='Confirm' onClick={handleSubmit(onSubmit)} isLoading={isLoading} />
            <div className='flex flex-row gap-2 text-sm'>
              <span style={{ color: colors.text_secondary }}>Already have an account?</span>
              <span
                style={{ color: colors.primary }}
                className='cursor-pointer font-medium'
                onClick={() => {
                  navigateToLogin()
                }}
              >
                Sign in
              </span>
            </div>
          </div>
        </div>
      </form>
    </PrimaryModal>
  )
}
