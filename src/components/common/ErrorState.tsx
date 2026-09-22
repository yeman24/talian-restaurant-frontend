import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'This service is temporarily unavailable. Please try again shortly.',
  onRetry,
}) => (
  <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-8 text-center text-[#12141a]">
    <AlertTriangle className="mx-auto mb-3 h-6 w-6 text-rose-700" />
    <p className="text-sm font-sans text-rose-900">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-sm border border-rose-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-900 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
      >
        Try again
      </button>
    )}
  </div>
)
