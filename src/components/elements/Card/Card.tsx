import React, { FC } from "react";
interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export const Card: FC<CardProps> = ({ className, children }) => {
  return <div>Card</div>;
};
