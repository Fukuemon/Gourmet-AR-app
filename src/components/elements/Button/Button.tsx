// ボタンコンポーネントのプロパティ型
type ButtonProps = {
  className?: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  children?: React.ReactNode;
  dataTooltipTarget?: string;
};

// ボタンコンポーネント
const Button: React.FC<ButtonProps> = ({
  dataTooltipTarget = "",
  className = "",
  type = "button",
  onClick = () => {},
  children,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={className}
    data-tooltip-target={dataTooltipTarget}
  >
    {children}
  </button>
);

export default Button;
