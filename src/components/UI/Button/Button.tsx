import Link from 'next/link';
import styles from './Button.module.scss';
import Image from 'next/image';
import arrowRight from "../../../../public/images/arrowRight.svg"
interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  href,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // If href is provided, render as Link
  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
        <Image alt='arrow Right' src={arrowRight} width={24} height={24} className={styles.arrow}/>
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
      <Image alt='arrow Right' src={arrowRight} width={24} height={24} className={styles.arrow}/>
    </button>
  );
}

