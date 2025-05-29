import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const initials = alt
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-emerald-100 text-emerald-800 flex items-center justify-center font-medium ${
        sizeClasses[size]
      } ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span className={`text-${size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'base'}`}>
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;