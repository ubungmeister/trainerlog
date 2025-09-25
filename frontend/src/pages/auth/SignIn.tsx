import { useForm } from "react-hook-form";
import { useLogin } from "hooks/auth/useLogin";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const FormSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(6).nonempty("Password is required"),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });
  const { mutate: login } = useLogin();

  const onSubmit = (data: FormSchemaType) => {
    login(data, {
      onSuccess: (response) => {
        toast.success("Success");
        localStorage.setItem("token", response.token);
        localStorage.setItem("fullName", response.fullName);
        localStorage.setItem("email", response.email);
        localStorage.setItem("id", response.id);
        window.location.href = "/";
      },
      onError: (error) => {
        console.error("Login failed:", error);
        toast.error("Login failed");
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
          <button type="submit" className="auth-form button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
