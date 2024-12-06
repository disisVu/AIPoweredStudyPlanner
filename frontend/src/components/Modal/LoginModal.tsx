import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { ButtonFullWidth } from '@/components/Button/ButtonFullWidth'
import { PrimaryModal } from '@/components/Modal/ModalLayouts'
import { FormInput, PasswordInput } from '@/components/Input'

import googleIcon from '@/assets/brands/google-48.png'
import { colors } from '@/styles'
import { emailRegex, handleLogin } from '@/utils'
import { LoginFormInputs } from '@/types/form'
import { useToast } from '@/hooks/use-toast'

export function LoginModal() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
    try {
      setIsLoading(true)
      const result = await handleLogin(data.email, data.password)
      if (result.success) {
        toast({
          title: 'Login successfully.',
          description: 'Proceeding to Home Page.'
        })
        navigateToHomepage()
      } else {
        toast({
          title: 'Login failed.',
          description: result.message
        })
      }
    } catch (error) {
      toast({
        title: 'Login failed.',
        description: 'An error occured during login.'
      })
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToHomepage = () => {
    navigate('/')
  }

  const navigateToRegistration = () => {
    navigate('/auth/registration')
  }

  return (
    <PrimaryModal isOpen={true}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='flex w-full flex-col gap-8'>
          <div className='flex w-full flex-col items-start gap-1'>
            <span style={{ color: colors.text_primary }} className='text-3xl font-bold'>
              Login
            </span>
            <span style={{ color: colors.text_secondary }} className='text-sm'>
              Welcome back!
            </span>
          </div>
          <div className='flex w-full flex-col items-start gap-4'>
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
            <Controller
              name='password'
              control={control}
              rules={{
                required: 'Required',
                minLength: { value: 8, message: 'Password must contain at least 8 characters.' }
              }}
              render={({ field: { value, onChange } }) => (
                <PasswordInput
                  label='Password'
                  placeholder='Enter password here'
                  value={value}
                  autocomplete='current-password'
                  onChange={onChange}
                  indicator={errors.password ? errors.password.message || '' : ''}
                />
              )}
            />
          </div>
          <div className='flex w-full flex-col items-center'>
            <ButtonFullWidth enabled={true} text='Confirm' onClick={handleSubmit(onSubmit)} isLoading={isLoading} />
            <ButtonFullWidth
              enabled={true}
              text='Sign in with Google'
              onClick={() => {}}
              isLoading={isLoading}
              backgroundColor='white'
              textColor={colors.text_primary}
              borderColor={colors.border}
              startAdornment={googleIcon}
            />
            <div className='flex flex-row gap-2 text-sm'>
              <span style={{ color: colors.text_secondary }}>Don't have an account?</span>
              <span
                style={{ color: colors.primary }}
                className='cursor-pointer font-medium'
                onClick={() => {
                  navigateToRegistration()
                }}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </form>
    </PrimaryModal>
  )
}
