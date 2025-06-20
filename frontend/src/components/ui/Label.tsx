interface LabelProps {
    htmlFor: string;
    children: React.ReactNode;
}

export const Label = ({ htmlFor, children }: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-gray-700 text-sm font-bold mb-2"
        >
            {children}
        </label>
    );
}