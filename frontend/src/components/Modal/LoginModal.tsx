import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { ButtonFullWidth } from '@/components/Button/ButtonFullWidth'
import { PrimaryModal } from '@/components/Modal/ModalLayouts'
import { FormInput, PasswordInput } from '@/components/Input'

import googleIcon from '@/assets/brands/google-48.png'
import { colors } from '@/styles'
import { emailRegex, loginWithEmailAndPassword, loginWithGoogle, resetPassword } from '@/utils'
import { LoginFormInputs, ResetPasswordFormInputs } from '@/types/form'
import { useToast } from '@/hooks/use-toast'

export function LoginModal() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState<boolean>(false)

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

  const {
    control: resetPasswordControl,
    handleSubmit: handleResetPasswordSubmit,
    formState: { errors: resetPasswordErrors }
  } = useForm<ResetPasswordFormInputs>({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
    try {
      setIsLoading(true)
      const result = await loginWithEmailAndPassword(data.email, data.password)
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

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const result = await loginWithGoogle()
      if (result.success) {
        toast({
          title: 'Login with Google successfully.',
          description: 'Proceeding to Home Page.'
        })
        navigateToHomepage()
      } else {
        toast({
          title: 'Login with Google failed.',
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

  const handleResetPassword = async (email: string) => {
    try {
      setIsLoading(true)
      const result = await requestPasswordReset(email)
      if (result.success) {
        toast({
          title: 'Reset email sent.',
          description: 'Check your inbox for a reset link.'
        })
        setIsResetPasswordOpen(false) // Close modal after success
      } else {
        toast({
          title: 'Reset failed.',
          description: result.message
        })
      }
    } catch (error) {
      toast({
        title: 'Reset failed.',
        description: 'An error occurred while requesting the reset email.'
      })
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await resetPassword(email)
      return {
        success: true,
        message: response.message
      }
    } catch {
      return {
        success: false,
        message: 'An error occurred while sending the reset password email.'
      }
    }
  }

  return (
    <>
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
            <div className='flex w-full flex-col items-center gap-5'>
              <ButtonFullWidth enabled={true} text='Confirm' onClick={handleSubmit(onSubmit)} isLoading={isLoading} />
              <ButtonFullWidth
                enabled={true}
                text='Sign in with Google'
                onClick={() => {
                  handleGoogleLogin()
                }}
                isLoading={isLoading}
                backgroundColor='white'
                textColor={colors.text_primary}
                borderColor={colors.border}
                startAdornment={googleIcon}
              />
              <div className='flex w-full flex-col items-center gap-2'>
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
                <div className='flex flex-row gap-2 text-sm'>
                  <span style={{ color: colors.text_secondary }}>Forgot your password?</span>
                  <span
                    style={{ color: colors.primary }}
                    className='cursor-pointer font-medium'
                    onClick={() => setIsResetPasswordOpen(true)}
                  >
                    Reset here!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </PrimaryModal>
      {/* Reset Password Modal */}

      {isResetPasswordOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <PrimaryModal isOpen={true}>
            <div className='flex w-full flex-col gap-4'>
              <span className='mb-6 text-left text-3xl font-bold'>Reset Password</span>
              <form
                onSubmit={handleResetPasswordSubmit(({ email }) => {
                  handleResetPassword(email)
                })}
                className='flex flex-col gap-4'
              >
                <Controller
                  name='email'
                  control={resetPasswordControl}
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
                      indicator={resetPasswordErrors.email ? resetPasswordErrors.email.message || '' : ''}
                    />
                  )}
                />
                <ButtonFullWidth
                  enabled={!isLoading}
                  text='Send Reset Email'
                  isLoading={isLoading}
                  onClick={handleResetPasswordSubmit(({ email }) => handleResetPassword(email))}
                />
              </form>
              <button
                className='bg-gray-200'
                style={{ color: colors.text_primary }}
                onClick={() => setIsResetPasswordOpen(false)}
              >
                Close
              </button>
            </div>
          </PrimaryModal>
        </div>
      )}
    </>
  )
}
