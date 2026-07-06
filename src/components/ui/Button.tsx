import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  ghost: 'btn bg-transparent text-cocoa-600 hover:bg-cocoa-600/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      className={`${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
);
Button.displayName = 'Button';

export type { ButtonHTMLAttributes };
