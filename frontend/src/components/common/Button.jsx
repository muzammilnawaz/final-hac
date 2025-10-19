import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, ...props }) => {
  const baseStyle = "w-full py-3 px-4 font-bold rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const styles = {
    primary: "bg-cyan-500 text-gray-900 hover:bg-cyan-400",
    secondary: "bg-gray-600 text-white hover:bg-gray-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;