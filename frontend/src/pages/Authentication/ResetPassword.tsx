import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PasswordComplexityBar } from '@/components/Bar';
import { PasswordInput } from '@/components/Input';
import { PrimaryModal } from '@/components/Modal/ModalLayouts';
import { colors } from '@/styles';
import { computePasswordComplexity } from '@/utils';
import { Controller, useForm } from 'react-hook-form';
import { RegistrationFormInputs } from '@/types/form';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>(); // Extract the token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const {
        control,
        watch,
        trigger,
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

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({
                title: 'Reset password failed',
                description: 'An error occured during registration.'
            })
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, {
                newPassword,
            });
            toast({
                title: 'Password reset successfully',
                description: 'Password reset successfully.Redirecting to login...'
            })
            navigateToLogin()
        } catch (err: any) {
            setIsLoading(false)
            toast({
                title: 'Password reset failed',
                description: err.response?.data?.message || 'An error occurred. Please try again.'
            })
        }
    };

    const navigateToLogin = () => {
        navigate('/auth/login')
    }

    return (
        <PrimaryModal isOpen={true}>
            <form onSubmit={handleResetPassword} className="w-full">
                <div className="flex w-full flex-col gap-10">
                    <div className="flex w-full flex-col items-start gap-1">
                        <span style={{ color: colors.text_primary }} className="text-3xl font-bold">
                            Reset Password
                        </span>
                        <span style={{ color: colors.text_secondary }} className="text-sm">
                            Reset your password here
                        </span>
                    </div>
                    <div className="flex w-full flex-col items-start gap-7">
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
                                                setNewPassword(val)
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
                                        setConfirmPassword(val)
                                        trigger('confirmPassword')
                                    }}
                                    indicator={errors.confirmPassword ? errors.confirmPassword.message || '' : ''}
                                />
                            )}
                        />
                    </div>
                    <div className="flex w-full flex-col items-center gap-5">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </form>
        </PrimaryModal>

    )
};

export default ResetPassword;

