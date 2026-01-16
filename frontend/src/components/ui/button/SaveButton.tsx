interface SaveButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SaveButton = ({
  children = "Save",
  disabled,
}: SaveButtonProps) => {
  return (
    <button
      className="bg-primary-bg text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-secondary disabled:opacity-50"
      type="submit"
      disabled={disabled}
    >
      {children}
    </button>
  );
};
