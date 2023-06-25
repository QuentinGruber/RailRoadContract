type GradientButtonProps = {
  onClick: () => void;
  type: "button" | "submit";
  text: string;
  className?: string;
};

export function GradientButton(props: GradientButtonProps) {
  const { onClick, type, text, className } = props;
  return (
    <button
      onClick={onClick}
      type={type}
      className={"gradientButton " + className}
    >
      {text}
    </button>
  );
}
