import React from 'react';

interface BodyFormContainerProps {
  children: React.ReactNode;
  className?: string; // para extender estilos
}

export default function BodyFormContainer({ children, className = '' }: BodyFormContainerProps) {
  return (
    <div
      className={`
        flex flex-col mt-10 gap-12 w-full 
        border-l-2 border-white  
        max-[550px]:gap-10 
        max-[1200px]:gap-20 
        ${className}
      `}
    >
      {children}
    </div>
  );
}