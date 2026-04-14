import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#005c4b] text-white hover:bg-[#004a3c] focus:ring-[#005c4b] px-5 py-2.5 shadow-sm",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-200 px-5 py-2.5",
    outline: "border-2 border-[#005c4b] text-[#005c4b] hover:bg-[#005c4b] hover:text-white px-5 py-2",
    ghost: "text-gray-600 hover:text-[#005c4b] hover:bg-gray-100 px-4 py-2"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
