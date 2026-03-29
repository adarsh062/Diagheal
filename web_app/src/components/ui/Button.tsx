import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export default function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  const baseStyles = "px-8 py-3 font-poppins text-sm font-medium tracking-wide rounded-full transition transform hover:-translate-y-1 shadow-lg dark:shadow-none";

  const variants = {
    primary: "bg-[#2B86C5] text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500",
    outline: "bg-transparent border-[2px] border-[#2B86C5] dark:border-cyan-400 text-gray-900 dark:text-gray-100 hover:bg-[#2B86C5] hover:text-white dark:hover:bg-cyan-600 dark:hover:border-cyan-600"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}