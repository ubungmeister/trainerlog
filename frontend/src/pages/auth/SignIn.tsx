import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { ROUTES } from "app/utils/routes/routes.constants";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const FormSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(6).nonempty("Password is required"),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const { loginMutation } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: FormSchemaType) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Welcome back!");
        navigate(ROUTES.HOME, { replace: true });
      },
      onError: (error) => {
        console.error("Login failed:", error);
        toast.error("Login failed. Please check your credentials.");
      },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label>Email:</label>
            <input type="email" {...register("email", { required: true })} />
            {errors.email && <span className="">{errors.email.message}</span>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="auth-form button"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
