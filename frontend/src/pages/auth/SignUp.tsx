import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "hooks/auth/useRegister";
import { ROUTES } from "app/utils/routes/routes.constants";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

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

export default function Signup() {
  const navigate = useNavigate();
  const { mutate: createUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    const payload = { ...data, role: "TRAINER" };
    createUser(payload, {
      onSuccess: () => {
        toast.success("Account created successfully! Please sign in.");
        navigate(ROUTES.AUTH.SIGN_IN, { replace: true });
      },
      onError: (error) => {
        console.error("Registration failed:", error);
        toast.error("Registration failed. Please try again.");
      },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label>Email:</label>
            <input type="email" {...register("email", { required: true })} />
            {errors.email && <span className="">{errors.email.message}</span>}
          </div>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              {...register("fullName", { required: true })}
              className="auth-form input"
            />
            {errors.fullName && (
              <span className="">{errors.fullName.message}</span>
            )}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="auth-form input"
            />
            {errors.password && (
              <span className="">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="auth-form button"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to={ROUTES.AUTH.SIGN_IN}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
