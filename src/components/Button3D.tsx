import React from 'react';

export interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'burgundy' | 'charcoal' | 'outline' | 'emerald';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button3D: React.FC<Button3DProps> = ({
  variant = 'gold',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-[11px] rounded-lg tracking-wider font-bold',
    sm: 'px-4 py-2 text-xs rounded-xl tracking-wider font-bold',
    md: 'px-5 py-2.5 text-xs rounded-xl tracking-wider font-bold',
    lg: 'px-7 py-3.5 text-sm rounded-2xl tracking-wider font-bold'
  };

  const variantClasses = {
    gold: 'btn-3d-gold',
    burgundy: 'btn-3d-burgundy',
    charcoal: 'btn-3d-charcoal',
    outline: 'bg-transparent border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 hover:border-gold-400 active:scale-[0.98] shadow-md transition-all',
    emerald: 'bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 text-cream-100 border border-emerald-400/40 shadow-[0_4px_0_#064e3b,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-[3px] active:shadow-[0_1px_0_#064e3b,0_3px_8px_rgba(0,0,0,0.4)] transition-all'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 uppercase select-none
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Specular gloss top reflection */}
      <span className="gloss-specular" aria-hidden="true" />

      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span className="relative z-10">{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
