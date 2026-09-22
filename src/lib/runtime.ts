// Demo content is never permitted in a production bundle.
export const IS_DEMO_MODE = import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === 'true'
export const DEPOSIT_REQUIRED = import.meta.env.VITE_DEPOSIT_REQUIRED === 'true'
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

export const API_ERROR_MESSAGE =
  'The AURA service is temporarily unavailable. Please try again in a moment.'
