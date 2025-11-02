import React from 'react';

/**
 * Loading spinner component
 * @param {object} props - Component props
 * @param {string} props.size - Size of loader (sm, md, lg)
 * @param {string} props.text - Loading text to display
 * @param {boolean} props.fullScreen - Whether to show full screen loader
 */
export const Loader = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className="flex items-center space-x-3">
      <div
        className={`${sizes[size]} border-cyan-400 border-t-transparent rounded-full animate-spin`}
      />
      {text && <span className="text-cyan-400 font-medium">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;