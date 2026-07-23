interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function GoogleButton({ onClick, disabled }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn w-full border border-cocoa-600/15 bg-white text-cocoa-700 shadow-soft hover:bg-cocoa-600/[0.04] active:scale-[0.97]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.1-6.71-4.93H1.28v3.1C3.25 21.3 7.28 24 12 24Z"
        />
        <path fill="#FBBC05" d="M5.29 14.32a7.2 7.2 0 0 1 0-4.64v-3.1H1.28a12 12 0 0 0 0 10.84l4.01-3.1Z" />
        <path
          fill="#EA4335"
          d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.25 2.7 1.28 6.58l4.01 3.1C6.23 6.86 8.88 4.77 12 4.77Z"
        />
      </svg>
      Continue with Google
    </button>
  );
}
