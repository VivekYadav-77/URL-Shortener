const variants = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "border hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

const Button = ({
  children,
  onClick,
  className,
  type = "button",
  variant = "primary",
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
