import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import {useRegister} from 'hooks/auth/useRegister';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

export interface SignupFormData {
    email: string;
    fullName: string;
    password: string;
    role: string;
}

const FormSchema = z.object({
    email: z.string().email("Invalid email").nonempty("Email is required"),
    fullName: z.string().min(2).max(100).nonempty("Full name is required"),
    password: z.string().min(6).nonempty("Password is required"),
});

type FormSchemaType = z.infer<typeof FormSchema>;



export const Signup = () => {
    const { mutate: createUser } = useRegister();


    const { register, handleSubmit, formState: { errors } } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
        const payload = { ...data, role: "TRAINER" };
        createUser(payload);
    };
    // test
    
    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <label>
                            Email:
                        </label>
                        <input 
                            type="email" 
                            {...register("email", { required: true })}
                        />
                       
                        {errors.email && <span className="">{errors.email.message}</span>}
                       
                    </div>
                    <div>
                        <label>
                            Full Name:
                        </label>
                        <input 
                            type="text" 
                            {...register("fullName", { required: true })}
                            className="auth-form input"
                        />
                        {errors.fullName && <span className="">{errors.fullName.message}</span>}
                    </div>
                    <div>
                        <label>
                            Password:
                        </label>
                        <input 
                            type="password" 
                            {...register("password", { required: true })}
                            className="auth-form input"
                        />
                        {errors.password && <span className="">{errors.password.message}</span>}
                    </div>
                    <button 
                        type="submit" 
                        className="auth-form button"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

 