import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { ButtonFullWidth } from '@/components/Button/ButtonFullWidth'
import { PrimaryModal } from '@/components/Modal/ModalLayouts'
import { FormInput, PasswordInput } from '@/components/Input'

import googleIcon from '@/assets/brands/google-48.png'
import { colors } from '@/styles'
import { emailRegex, loginWithEmailAndPassword, loginWithGoogle } from '@/utils'
import { LoginFormInputs } from '@/types/form'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

export function LoginModal() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

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

  const handleForgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const result = await requestPasswordReset(email); // Call your backend API
      if (result.success) {
        toast({
          title: 'Reset email sent.',
          description: 'Check your inbox for a reset link.',
        });
        setIsForgotPasswordOpen(false); // Close modal after success
      } else {
        toast({
          title: 'Reset failed.',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: 'Reset failed.',
        description: 'An error occurred while requesting the reset email.',
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("asdqwsadawdqcawfeasc " + email + " asdsdadsdsa");
      const response = await axios.post('http://localhost:5000/auth/forgot-password', { email }); // Adjust the endpoint as needed
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred while sending the reset email.',
      };
    }
  };


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
                  onClick={() => setIsForgotPasswordOpen(true)}>
                  Reset here!
                </span>
              </div>
            </div>
          </div>
        </form>
      </PrimaryModal>
      {/* Forgot Password Modal */}

      {isForgotPasswordOpen && (
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
            zIndex: 1000,
          }}
        >
          <PrimaryModal isOpen={true}>
            <div className="w-full flex flex-col gap-6" >
              <span className="text-xl font-bold">Forgot Password</span>
              <form
                onSubmit={handleSubmit(({ email }) => {
                  handleForgotPassword(email); // Pass email from form state
                })}
                className="flex flex-col gap-4"
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Required',
                    pattern: { value: emailRegex, message: 'Invalid email format.' },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <FormInput
                      label="Email"
                      type="email"
                      placeholder="Enter email here"
                      value={value}
                      autocomplete="email"
                      onChange={onChange}
                      indicator={errors.email ? errors.email.message || '' : ''}
                    />
                  )}
                />
                <ButtonFullWidth
                  enabled={!isLoading}
                  text="Send Reset Email"
                  isLoading={isLoading}
                  onClick={handleSubmit(({ email }) => handleForgotPassword(email))}
                />
              </form>
              <button
                className="text-red-500 mt-4"
                onClick={() => setIsForgotPasswordOpen(false)} >
                Close
              </button>
            </div>
          </PrimaryModal>
        </div>
      )}

    </>
  )
}
