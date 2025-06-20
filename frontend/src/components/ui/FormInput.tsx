import { type UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  register: UseFormRegisterReturn; // Accepts the result of register("field", options)
}

export const FormInput: React.FC<FormInputProps> = ({
  error,
  register,
  ...inputProps
}) => (
  <div className="mb-4">
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      {...register}
      {...inputProps}
    />
    {error && <span className="text-red-500 text-xs italic">{error}</span>}
  </div>
);
