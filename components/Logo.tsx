const Logo = ({ className = 'h-8' }: { className?: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="#10B981" strokeWidth="4"/>
        <path d="M35 65V35H65" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M45 55H65" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round"/>
        <path d="M45 45H55" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round"/>
      </svg>
      <span className="font-bold text-xl text-gray-800">Easy Earning</span>
    </div>
  );
};

export default Logo;
