import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarDisplay = ({ count = 1, size = "sm", className = "" }) => {
  const stars = Array(count).fill(0);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars.map((_, index) => (
        <FaStar 
          key={index} 
          className={`${sizeClasses[size]} text-yellow-400 animate-pulse`}
        />
      ))}
    </div>
  );
};

export default StarDisplay;
