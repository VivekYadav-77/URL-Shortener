const variants = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "border hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
