import React from "react";

type ButtonVariant = "primary" | "secondary" 

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}) => {
  const baseStyles =
    " transition-all  h-min duration-200 flex items-center justify-center gap-2";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary/60 text-white hover:bg-primary/90 active:scale-[0.98]",
    secondary:
      "bg-primary/5 text-white/80 hover:bg-gray-300/10 active:scale-[0.98]",
   };

  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:scale-100";

  const hoverState =
    "hover:-translate-y-[1px] hover:shadow-md";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={ `
        ${baseStyles}
        ${variants[variant]}
        ${disabled || loading ? disabledStyles : hoverState}
        ${className}`
      }
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};