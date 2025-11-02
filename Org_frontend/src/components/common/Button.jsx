export const Button = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg text-white ${variants[variant]} 
        disabled:opacity-50 transition-all duration-200`}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
