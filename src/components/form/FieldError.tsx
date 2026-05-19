type FieldErrorProps = {
  message?: string;
  className?: string;
};

export default function FieldError({ message, className = "" }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className={`text-xs text-rose-600 font-medium mt-1.5 ml-1 ${className}`.trim()}
    >
      {message}
    </p>
  );
}
