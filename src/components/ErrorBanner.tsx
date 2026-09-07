'use client';

interface ErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <span className="font-medium">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 rounded-md p-1 transition-colors hover:bg-destructive/20"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}