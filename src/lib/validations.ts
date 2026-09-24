import { z } from 'zod'

export const reservationSchema = z.object({
  guests: z.number().min(1, 'Please select at least 1 guest').max(8, 'For parties over 8, please contact private dining'),
  date: z.string().min(1, 'Please select a date'),
  service: z.enum(['lunch', 'dinner']),
  timeSlot: z.string().min(1, 'Please select a seating time'),
  experience: z.string().min(1, 'Please select a tasting experience'),
  pairing: z.enum(['none', 'sommelier', 'prestige', 'non-alcoholic']),
  seatingPreference: z.enum(['dining-room', 'chefs-counter', 'vault-alcove']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please provide a contact telephone number'),
  dietaryNotes: z.string().optional(),
  specialOccasion: z.string().optional(),
  agreeToPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the reservation and cancellation policy',
  }),
})

export type ReservationFormInput = z.infer<typeof reservationSchema>

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  inquiryType: z.enum(['general', 'private-dining', 'press', 'cellar-master']),
  guestsCount: z.number().optional(),
  preferredDate: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormInput = z.infer<typeof contactSchema>

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address for our salon gazette'),
})

export type NewsletterFormInput = z.infer<typeof newsletterSchema>
