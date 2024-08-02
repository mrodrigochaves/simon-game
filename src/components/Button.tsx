import React from 'react';


type ButtonColor = 'green' | 'red' | 'yellow' | 'blue';

interface ButtonProps {
  id: string;
  color: ButtonColor; 
  onClick: (color: ButtonColor) => void;
  pressed: boolean;
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({ id, color, onClick, pressed, className }) => {
  return (
    <div
      id={id}
      className={`btn ${color} ${pressed ? 'pressed' : ''} ${className || ''}`} 
      onClick={() => onClick(color)}
    />
  );
};

export default Button;
