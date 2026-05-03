const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-surface-500 text-sm font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
