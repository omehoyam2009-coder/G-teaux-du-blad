import React from 'react';

export default function VintageCard({
  children,
  className = "",
  onClick,
  innerClassName = "",
  hoverEffect = false,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden transition-colors border border-[#d6c4a5] bg-[#f5ede0] ${
        hoverEffect ? 'hover:border-[#ba8a24]' : ''
      } ${className}`}
    >
      <div className={`relative z-10 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
