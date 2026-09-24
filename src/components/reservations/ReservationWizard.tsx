import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { reservationSchema, type ReservationFormInput } from '@/lib/validations'
import { useCreateReservation, useAvailability, useCreatePaymentIntent } from '@/hooks/useDishes'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/common/Button'
import { formatCurrency } from '@/lib/utils'
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Utensils,
  Wine,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  Printer,
} from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'
import type { ReservationPayload } from '@/types'
import { DEPOSIT_REQUIRED, STRIPE_PUBLISHABLE_KEY } from '@/lib/runtime'

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null

const PaymentForm: React.FC<{
  clientSecret: string
  amount: number
  name: string
  email: string
  onPaid: () => void
}> = ({ clientSecret, amount, name, email, onPaid }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitPayment = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return
    setIsSubmitting(true)
    setError(null)
    const card = elements.getElement(CardElement)
    if (!card) {
      setError('Payment form is not ready yet. Please try again.')
      setIsSubmitting(false)
      return
    }
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card, billing_details: { name, email } },
    })
    if (result.error) setError(result.error.message || 'The payment could not be completed.')
    else if (result.paymentIntent?.status === 'succeeded' || result.paymentIntent?.status === 'processing') onPaid()
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={submitPayment} className="max-w-xl mx-auto bg-white border border-[#e2d7ba] rounded-xl p-6 sm:p-10 shadow-xl text-[#12141a]">
      <h2 className="font-serif text-3xl font-normal mb-2">Secure your reservation</h2>
      <p className="text-sm text-[#4a5160] mb-6">A deposit of {formatCurrency(amount)} is required to hold this sitting for 15 minutes.</p>
      <div className="rounded-lg border border-[#d8caa4] bg-[#fcf5df]/40 p-4">
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#12141a', '::placeholder': { color: '#8890a0' } } } }} />
      </div>
      {error && <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</p>}
      <button type="submit" disabled={!stripe || isSubmitting} className="mt-6 w-full rounded-lg bg-[#12141a] px-4 py-3 text-sm font-semibold text-[#fcf5df] disabled:opacity-50">{isSubmitting ? 'Processing…' : `Pay ${formatCurrency(amount)} deposit`}</button>
    </form>
  )
}

const EXPERIENCES = [
  {
    id: 'autumn-terroir',
    name: 'The Autumn Terroir (8 Courses)',
    price: 175,
    tagline: 'Signature hyper-seasonal odyssey across Scotland’s lochs and moors.',
    duration: '3 hours',
  },
  {
    id: 'foraged-harvest',
    name: 'The Forager’s Harvest (Plant-Based)',
    price: 155,
    tagline: 'Caledonian wild flora, ancient grains, and hand-foraged mushrooms.',
    duration: '3 hours',
  },
  {
    id: 'chefs-counter',
    name: 'Chef’s Atelier Counter (10 Courses)',
    price: 225,
    tagline: 'Intimate front-row kitchen counter with Chef Patron Euan Macleod.',
    duration: '3.5 hours',
  },
]

const PAIRINGS = [
  { id: 'none', name: 'No Wine Pairing', price: 0, desc: 'A la carte beverage service on the evening' },
  { id: 'sommelier', name: 'Sommelier Wine Pairing', price: 115, desc: 'Curated artisanal & biodynamic European producers' },
  { id: 'prestige', name: 'Prestige Cellar Grand Cru', price: 195, desc: 'Rare library vintages and silent distillery single malts' },
  { id: 'non-alcoholic', name: 'Foraged Botanical Infusions', price: 65, desc: 'Wild herb cordials, cold-extracted teas, and ferments' },
]

const DINNER_SLOTS = [
  { time: '17:30', status: 'Available', isAvailable: true },
  { time: '18:15', status: '2 tables left', isAvailable: true },
  { time: '19:00', status: 'Few tables left', isAvailable: true },
  { time: '19:45', status: 'Available', isAvailable: true },
  { time: '20:30', status: 'Available', isAvailable: true },
]

const SUNDAY_DINNER_SLOTS = [
  { time: '17:00', status: 'Available', isAvailable: true },
  { time: '17:45', status: 'Available', isAvailable: true },
  { time: '18:30', status: 'Few tables left', isAvailable: true },
  { time: '19:15', status: 'Available', isAvailable: true },
  { time: '19:45', status: 'Available', isAvailable: true },
]

const LUNCH_SLOTS = [
  { time: '12:00', status: 'Available', isAvailable: true },
  { time: '12:45', status: 'Available', isAvailable: true },
  { time: '13:15', status: 'Few tables left', isAvailable: true },
]

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const getDayOfWeek = (dateStr?: string): number => {
  if (!dateStr) return -1
  const clean = dateStr.split('T')[0]
  const [y, m, d] = clean.split('-').map(Number)
  if (!y || !m || !d) return -1
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

const formatDateDisplay = (dateStr?: string) => {
  if (!dateStr) return ''
  const clean = dateStr.split('T')[0]
  const [y, m, d] = clean.split('-').map(Number)
  if (!y || !m || !d) return dateStr
  const dateObj = new Date(Date.UTC(y, m - 1, d))
  return dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getInitialBookingDate = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  // Advance past closed days (Monday = 1, Tuesday = 2)
  while (d.getDay() === 1 || d.getDay() === 2) {
    d.setDate(d.getDate() + 1)
  }
  return getLocalDateString(d)
}

const formatSeatingLabel = (seat?: string) => {
  if (!seat) return 'Vault Dining Room'
  const s = seat.toLowerCase().replace(/_/g, '-')
  if (s.includes('chef')) return "Chef's Atelier Counter"
  if (s.includes('alcove') || s.includes('vault')) return 'Stone Vault Alcove'
  return 'Vault Dining Room'
}

const formatPairingLabel = (tier?: string) => {
  if (!tier || tier === 'none') return 'A La Carte Beverage Service'
  const p = tier.toLowerCase()
  if (p.includes('somm')) return 'Sommelier Wine Pairing'
  if (p.includes('prest')) return 'Prestige Cellar Grand Cru'
  if (p.includes('non') || p.includes('botanical') || p.includes('tea')) return 'Foraged Botanical Infusions'
  return tier
}

/**
 * Generates and downloads a luxury RFC-5545 standard .ics calendar invite.
 * Compatible with Apple Calendar, Google Calendar, and Microsoft Outlook.
 */
const downloadCalendarInvite = (booking: ReservationPayload) => {
  try {
    const [year, month, day] = (booking.date || '').split('-')
    const [hour, minute] = (booking.timeSlot || '19:00').split(':')

    if (!year || !month || !day) return

    const pad = (val: string | number) => String(val).padStart(2, '0')
    const startDate = `${year}${pad(month)}${pad(day)}T${pad(hour || '19')}${pad(minute || '00')}00`

    // Default dining duration: 3 hours for multi-course tasting experience
    const endHourNum = (parseInt(hour || '19', 10) + 3) % 24
    const endDate = `${year}${pad(month)}${pad(day)}T${pad(endHourNum)}${pad(minute || '00')}00`

    const bookingCode = booking.confirmationCode || 'CONFIRMED'
    const guestCount = booking.guests || booking.guestsCount || 2
    const expName = booking.experience || booking.experienceName || 'Chef Tasting Experience'

    const title = `Dinner at AURA Edinburgh (#${bookingCode})`
    const description = [
      `AURA Edinburgh — Two Michelin Stars`,
      `Official Dining Reservation #${bookingCode}`,
      `Guest: ${booking.fullName || 'Valued Guest'}`,
      `Party: ${guestCount} Guests`,
      `Service: ${expName}`,
      `Location: 14–16 Royal Terrace Vaults, Edinburgh, EH7 5TB`,
      `Concierge: +44 131 556 0000 / reservations@aura-edinburgh.com`,
      `Important: Please arrive 10 minutes prior to your seating. Dress code: Smart elegant attire.`
    ].join('\\n')

    const location = '14–16 Royal Terrace Vaults, Edinburgh, EH7 5TB, United Kingdom'

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AURA Edinburgh//Dining Pass//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:aura-booking-${bookingCode}-${Date.now()}@aura-edinburgh.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ]

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Aura_Reservation_${bookingCode}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to generate calendar invite:', err)
  }
}

export const ReservationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [confirmedBooking, setConfirmedBooking] = useState<ReservationPayload | null>(null)
  const [pendingPayment, setPendingPayment] = useState<{ booking: ReservationPayload; clientSecret: string; amount: number } | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { toast } = useToast()
  const createReservationMutation = useCreateReservation()
  const createPaymentMutation = useCreatePaymentIntent()
  const idempotencyKeyRef = useRef<string | null>(null)
  const paymentKeyRef = useRef<string | null>(null)

  const defaultDateStr = getInitialBookingDate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ReservationFormInput>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: {
      guests: 2,
      date: defaultDateStr,
      service: 'dinner',
      timeSlot: '19:00',
      experience: 'autumn-terroir',
      pairing: 'sommelier',
      seatingPreference: 'dining-room',
      fullName: '',
      email: '',
      phone: '',
      dietaryNotes: '',
      specialOccasion: '',
      agreeToPolicy: false,
    },
  })

  const formValues = watch()
  const {
    data: availability,
    isFetching: isCheckingAvailability,
    isError: isAvailabilityError,
    refetch: refetchAvailability,
  } = useAvailability(
    formValues.date,
    formValues.guests
  )

  // Calculate live tally
  const selectedExpObj = EXPERIENCES.find((e) => e.id === formValues.experience) || EXPERIENCES[0]
  const selectedPairObj = PAIRINGS.find((p) => p.id === formValues.pairing) || PAIRINGS[0]
  const pricePerGuest = (selectedExpObj?.price || 0) + (selectedPairObj?.price || 0)
  const totalEstimate = pricePerGuest * (formValues.guests || 2)
  const depositAmount = (formValues.guests || 2) * 50 // £50 deposit per guest

  const maxHorizonDateStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 90)
    return getLocalDateString(d)
  }, [])

  const selectedDayOfWeek = getDayOfWeek(formValues.date)
  const isSelectedLunchDay = selectedDayOfWeek === 5 || selectedDayOfWeek === 6
  const isSelectedSunday = selectedDayOfWeek === 0
  const isSelectedClosedDay = selectedDayOfWeek === 1 || selectedDayOfWeek === 2

  const selectedSlots = useMemo(() => {
    if (formValues.service === 'dinner') {
      if (availability?.dinnerSlots) return availability.dinnerSlots
      if (isSelectedSunday) return SUNDAY_DINNER_SLOTS
      return DINNER_SLOTS
    } else {
      if (availability?.lunchSlots) return availability.lunchSlots
      if (isSelectedLunchDay) return LUNCH_SLOTS
      return []
    }
  }, [availability, formValues.service, isSelectedSunday, isSelectedLunchDay])

  const availableSlots = useMemo(
    () => selectedSlots.filter((slot) => slot.isAvailable),
    [selectedSlots]
  )

  useEffect(() => {
    const selectedSlotIsAvailable = selectedSlots.some(
      (slot) => slot.time === formValues.timeSlot && slot.isAvailable
    )

    if (!selectedSlotIsAvailable) {
      setValue('timeSlot', availableSlots[0]?.time || '', { shouldValidate: true })
    }
  }, [availableSlots, selectedSlots, formValues.timeSlot, setValue])

  // When date changes from Friday/Saturday to another day while Lunch is selected, gently switch to dinner
  const previousDateRef = useRef<string>(formValues.date)
  useEffect(() => {
    if (previousDateRef.current && previousDateRef.current !== formValues.date) {
      const prevDay = getDayOfWeek(previousDateRef.current)
      const newDay = getDayOfWeek(formValues.date)
      if ((prevDay === 5 || prevDay === 6) && (newDay !== 5 && newDay !== 6) && formValues.service === 'lunch') {
        setValue('service', 'dinner', { shouldValidate: true })
        toast({
          title: 'Service updated to Dinner',
          message: 'Lunch service is only offered on Friday & Saturday. Switched to Dinner Service for this date.',
          type: 'info',
        })
      }
    }
    previousDateRef.current = formValues.date
  }, [formValues.date, formValues.service, setValue, toast])

  const validateStep = async (step: number) => {
    if (step === 1) {
      if (isCheckingAvailability) {
        toast({
          title: 'Checking table availability',
          message: 'Please wait a moment while we confirm the latest seating allocation.',
          type: 'info',
        })
        return false
      }

      if (isAvailabilityError || availability?.isAvailable === false || isSelectedClosedDay) {
        toast({
          title: 'No service on this date',
          message:
            availability?.message ||
            'AURA is closed on Mondays & Tuesdays for Highland foraging and cellar curation. Please choose Wednesday through Sunday.',
          type: 'error',
        })
        return false
      }

      if (formValues.service === 'lunch' && (!availability?.lunchSlots || availability.lunchSlots.length === 0)) {
        toast({
          title: 'Lunch Service Unavailable',
          message: 'Lunch is served exclusively on Friday and Saturday (12:00–14:30). Please choose Dinner Service or a Friday/Saturday date.',
          type: 'error',
        })
        return false
      }

      const valid = await trigger(['guests', 'date', 'service', 'timeSlot'])
      if (!valid) {
        if (!formValues.timeSlot) {
          toast({
            title: 'Select a Sitting Time',
            message: 'Please select an available sitting time to proceed with your booking.',
            type: 'error',
          })
        }
        return false
      }

      if (!availableSlots.some((slot) => slot.time === formValues.timeSlot)) {
        toast({
          title: 'Select an available sitting',
          message: 'That time is no longer available. Please choose one of the highlighted sittings.',
          type: 'error',
        })
        return false
      }

      return true
    }
    if (step === 2) {
      return await trigger(['experience', 'pairing', 'seatingPreference'])
    }
    if (step === 3) {
      return await trigger(['fullName', 'email', 'phone', 'agreeToPolicy'])
    }
    return true
  }

  const handleNext = async () => {
    const valid = await validateStep(currentStep)
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: ReservationFormInput) => {
    setSubmitError(null)
    if (DEPOSIT_REQUIRED && !stripePromise) {
      setSubmitError('Online deposits are temporarily unavailable. Please contact the concierge.')
      return
    }
    try {
      const result = await createReservationMutation.mutateAsync({
        date: data.date,
        timeSlot: data.timeSlot,
        service: data.service,
        guestsCount: data.guests,
        experienceName: selectedExpObj.name,
        pairingTier: data.pairing,
        seatingPreference: data.seatingPreference,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dietaryNotes: data.dietaryNotes,
        specialOccasion: data.specialOccasion,
        totalEstimate,
        policyAccepted: data.agreeToPolicy,
        idempotencyKey: idempotencyKeyRef.current || (idempotencyKeyRef.current = generateUUID()),
      })

      if (DEPOSIT_REQUIRED) {
        if (!result.id || !stripePromise) throw new Error('Online deposits are temporarily unavailable.')
        const payment = await createPaymentMutation.mutateAsync({
          reservationId: result.id,
          amount: depositAmount,
          email: data.email,
          idempotencyKey: paymentKeyRef.current || (paymentKeyRef.current = generateUUID()),
        })
        setPendingPayment({ booking: result, clientSecret: payment.clientSecret, amount: payment.amount })
        return
      }

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#f5eed8', '#dfc783'],
      })

      setConfirmedBooking(result)
      idempotencyKeyRef.current = null
      paymentKeyRef.current = null
      toast({
        title: result.status === 'PENDING' ? 'Reservation Received' : 'Reservation Confirmed',
        message: result.status === 'PENDING'
          ? `Booking #${result.confirmationCode} is awaiting deposit verification. Check your email for next steps.`
          : `Booking #${result.confirmationCode} has been secured. A confirmation email was sent to ${data.email}.`,
        type: 'success',
      })
    } catch (err: any) {
      const message = err?.message || 'We could not secure this table. Please review your details and try again.'
      setSubmitError(message)
      toast({
        title: 'Booking Error',
        message,
        type: 'error',
      })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {confirmedBooking ? (
        /* Confirmation Voucher Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="voucher-screen-wrapper bg-white border border-[#e2d7ba] rounded-xl p-8 sm:p-12 shadow-xl relative overflow-hidden text-[#12141a] print:border-none print:shadow-none print:p-0 print:m-0"
        >
          {/* Screen Only: Celebratory Banner */}
          <div className="no-print text-center max-w-2xl mx-auto mb-10">
            <div className="w-14 h-14 rounded-full bg-[#12141a] border border-[#12141a] flex items-center justify-center mx-auto mb-4 text-[#fcf5df]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-medium">
              {confirmedBooking.status === 'PENDING' ? 'Deposit Verification Pending' : 'Reservation Confirmed'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#12141a] font-normal mt-2 mb-4">
              We Look Forward to Welcoming You
            </h2>
            <p className="text-[#4a5160] text-sm leading-relaxed font-sans">
              {confirmedBooking.status === 'PENDING'
                ? 'Your reservation request has been received. We will confirm the table after the deposit is verified, and have sent next steps to '
                : 'Your table at AURA Edinburgh is confirmed. An electronic invitation containing directions and dietary verification has been dispatched to '}
              <span className="text-[#12141a] font-medium">{confirmedBooking.email}</span>.
            </p>
          </div>

          {/* Digital Printable Voucher Card - Sized for Strict 1-Page Real-World Printing */}
          <div className="printable-voucher bg-[#fcf5df]/60 border-2 border-[#12141a] rounded-xl p-5 sm:p-7 max-w-2xl mx-auto mb-6 relative shadow-md print:shadow-none print:max-w-none print:m-0 print:p-4 print:bg-white print:border-[1.5px] print:border-[#12141a]">
            {/* Voucher Header */}
            <div className="flex items-start justify-between border-b-2 border-[#12141a] pb-3.5 mb-4 print:pb-2 print:mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-3xl sm:text-4xl print:text-2xl text-[#12141a] tracking-wide block leading-none">
                    Aura
                  </span>
                  <span className="no-print bg-[#12141a] text-[#fcf5df] text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                    Digital Pass
                  </span>
                </div>
                <span className="block text-[10.5px] print:text-[8pt] text-[#12141a] font-sans font-bold uppercase tracking-[0.2em] mt-1.5 print:mt-0.5">
                  Edinburgh • Two Michelin Stars
                </span>
                <span className="block text-[9.5px] print:text-[7pt] text-[#5e6576] font-sans mt-0.5">
                  Royal Terrace Vaults • Cellar & Atelier Counter
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9.5px] print:text-[7pt] text-[#5e6576] uppercase tracking-widest block font-sans font-semibold">
                  Official Dining Pass
                </span>
                <span className="font-mono text-[#12141a] font-bold text-base print:text-sm tracking-wider bg-white px-3 py-0.5 rounded border-2 border-[#12141a] inline-block mt-1 shadow-sm">
                  {confirmedBooking.confirmationCode}
                </span>
                <span className="block text-[9.5px] print:text-[7pt] text-emerald-800 font-sans font-bold uppercase tracking-wider mt-0.5">
                  ✓ Table Confirmed
                </span>
              </div>
            </div>

            {/* Table Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 print:grid-cols-3 gap-3 print:gap-x-4 print:gap-y-1.5 text-xs print:text-[8pt] font-sans border-b border-[#e2d7ba] pb-4 print:pb-2">
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Guest Name</span>
                <span className="text-[#12141a] font-bold text-sm print:text-[9pt] block mt-0.5">{confirmedBooking.fullName}</span>
              </div>
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Contact Email</span>
                <span className="text-[#12141a] font-medium truncate block mt-0.5" title={confirmedBooking.email}>{confirmedBooking.email}</span>
              </div>
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Telephone</span>
                <span className="text-[#12141a] font-medium block mt-0.5">{confirmedBooking.phone || 'Verified'}</span>
              </div>
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Reservation Date</span>
                <span className="text-[#12141a] font-bold block mt-0.5">
                  {formatDateDisplay(confirmedBooking.date)}
                </span>
              </div>
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Sitting Window</span>
                <span className="text-[#12141a] font-bold block mt-0.5">
                  {confirmedBooking.timeSlot} ({confirmedBooking.service === 'lunch' || confirmedBooking.service === 'LUNCH' ? 'Lunch Service' : getDayOfWeek(confirmedBooking.date) === 0 ? 'Sunday Supper' : 'Dinner Service'})
                </span>
              </div>
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Party Size</span>
                <span className="text-[#12141a] font-bold block mt-0.5">{confirmedBooking.guests || confirmedBooking.guestsCount || 2} Guests</span>
              </div>
              <div className="sm:col-span-2 print:col-span-2">
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Tasting Experience</span>
                <span className="text-[#12141a] font-bold text-sm print:text-[8.5pt] block mt-0.5">{confirmedBooking.experience || confirmedBooking.experienceName}</span>
              </div>
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Seating Atmosphere</span>
                <span className="text-[#12141a] font-medium block mt-0.5">{formatSeatingLabel(confirmedBooking.seatingPreference)}</span>
              </div>
              <div className="sm:col-span-2 print:col-span-2">
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Cellar Beverage Program</span>
                <span className="text-[#12141a] font-medium block mt-0.5">{formatPairingLabel(confirmedBooking.pairingTier || confirmedBooking.pairing)}</span>
              </div>
              <div>
                <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Estimated Total</span>
                <span className="text-[#12141a] font-serif text-lg print:text-base font-bold block mt-0.5">
                  {formatCurrency(confirmedBooking.totalEstimate)}
                </span>
              </div>
              {confirmedBooking.dietaryNotes && (
                <div className="col-span-2 sm:col-span-3 print:col-span-3 pt-0.5">
                  <span className="text-[#5e6576] block text-[9.5px] print:text-[7pt] uppercase tracking-wider font-semibold">Dietary & Allergen Notes</span>
                  <span className="text-[#12141a] font-medium block mt-0.5">{confirmedBooking.dietaryNotes}</span>
                </div>
              )}
            </div>

            {/* Real-World Hospitality & Arrival Guidance: 3 Columns in Print to prevent page spill */}
            <div className="py-3 print:py-2 border-b border-[#e2d7ba] grid grid-cols-1 print:grid-cols-3 gap-2.5 print:gap-3 text-[10px] print:text-[7pt] font-sans text-[#4a5160] leading-snug">
              <div>
                <strong className="text-[#12141a] block mb-0.5">Arrival Notice:</strong>
                <span>Present pass or code at 14–16 Royal Terrace Vaults. Kindly arrive 10 minutes prior to sitting time.</span>
              </div>
              <div>
                <strong className="text-[#12141a] block mb-0.5">Dress Code:</strong>
                <span>Smart elegant attire welcomed; athletic footwear, sportswear, and shorts are strictly prohibited in dining vaults.</span>
              </div>
              <div>
                <strong className="text-[#12141a] block mb-0.5">Cancellations:</strong>
                <span>Due to bespoke daily sourcing from local foragers, 48 hours notice is required for adjustments.</span>
              </div>
            </div>

            {/* Venue Footer Coordinates */}
            <div className="pt-2.5 print:pt-1.5 flex flex-col sm:flex-row print:flex-row items-center justify-between text-[9.5px] print:text-[7pt] text-[#5e6576] font-sans gap-1">
              <span className="font-medium text-[#12141a]">14–16 Royal Terrace Vaults, Edinburgh, EH7 5TB</span>
              <span>Tel: +44 131 556 0000 • reservations@aura-edinburgh.com</span>
            </div>
          </div>

          {/* Screen Only Action Buttons - Real-World Hospitality Suite */}
          <div className="no-print flex flex-wrap justify-center items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              onClick={() => downloadCalendarInvite(confirmedBooking)}
              className="flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Add to Calendar (.ics)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white text-[#12141a] border-[#12141a] hover:bg-[#fcf5df] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print 1-Page Dining Pass</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConfirmedBooking(null)
                setCurrentStep(1)
              }}
              className="text-[#5e6576] border-[#d8caa4] hover:text-[#12141a] cursor-pointer"
            >
              Make Another Reservation
            </Button>
          </div>
        </motion.div>
      ) : pendingPayment ? (
        <Elements stripe={stripePromise}>
          <PaymentForm
            clientSecret={pendingPayment.clientSecret}
            amount={pendingPayment.amount}
            name={pendingPayment.booking.fullName}
            email={pendingPayment.booking.email}
            onPaid={() => {
              setConfirmedBooking({ ...pendingPayment.booking, depositAmount: pendingPayment.amount })
              setPendingPayment(null)
              idempotencyKeyRef.current = null
              paymentKeyRef.current = null
            }}
          />
        </Elements>
      ) : (
        /* Multi-step Form Wizard */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Form */}
          <div className="lg:col-span-8 bg-white border border-[#e2d7ba] rounded-xl p-6 sm:p-10 shadow-lg text-[#12141a]">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e2d7ba]">
              {[
                { step: 1, label: 'Date & Time' },
                { step: 2, label: 'Experience' },
                { step: 3, label: 'Guest Details' },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex items-center gap-3"
                  aria-current={currentStep === s.step ? 'step' : undefined}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      currentStep === s.step
                        ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-md'
                        : currentStep > s.step
                        ? 'bg-[#fcf5df] text-[#12141a] border border-[#d8caa4] font-semibold'
                        : 'bg-[#fcf5df]/40 text-[#8890a0] border border-[#e2d7ba]'
                    }`}
                  >
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider hidden sm:inline font-sans ${
                      currentStep === s.step ? 'text-[#12141a] font-medium' : 'text-[#8890a0]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit((data: any) => onSubmit(data))}>
              {/* STEP 1: Guests, Date, Service, Time */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="font-serif text-3xl text-[#12141a] font-normal mb-1">
                      Select Party & Sittings
                    </h3>
                    <p className="text-xs text-[#5e6576] font-sans">
                      Choose your party size, preferred dining date, and table service time.
                    </p>
                  </div>

                  {/* Guests Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium mb-3 font-sans">
                      Number of Guests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setValue('guests', num, { shouldValidate: true })}
                          className={`w-11 h-11 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                            formValues.guests === num
                              ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-md'
                              : 'bg-[#fcf5df]/40 text-[#12141a] border border-[#d8caa4] hover:bg-white hover:border-[#12141a]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {errors.guests && (
                      <p className="text-xs text-rose-500 mt-2 font-sans">{errors.guests.message}</p>
                    )}
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium mb-3 font-sans">
                      Reservation Date
                    </label>
                    <div className="relative max-w-sm">
                      <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5160] pointer-events-none" />
                      <input
                        type="date"
                        min={getLocalDateString(new Date())}
                        max={maxHorizonDateStr}
                        {...register('date')}
                        aria-invalid={errors.date ? 'true' : 'false'}
                        aria-describedby={errors.date ? 'reservation-date-error' : undefined}
                        className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md pl-10 pr-4 py-3 text-xs text-[#12141a] focus:outline-none cursor-pointer font-sans"
                      />
                    </div>
                    {errors.date && (
                      <p id="reservation-date-error" className="text-xs text-rose-500 mt-2 font-sans">{errors.date.message}</p>
                    )}
                    <p className="text-[11px] mt-2 font-sans flex items-center gap-1.5">
                      {isSelectedClosedDay ? (
                        <span className="text-amber-800 font-medium">Mondays & Tuesdays: Closed for Highland foraging & cellar curation</span>
                      ) : isSelectedSunday ? (
                        <span className="text-emerald-800 font-medium">Sunday Supper service (17:00 – 22:00)</span>
                      ) : isSelectedLunchDay ? (
                        <span className="text-emerald-800 font-medium">Open for Lunch (12:00–14:30) & Dinner (17:30–23:00)</span>
                      ) : (
                        <span className="text-[#5e6576]">Dinner service only (17:30–23:00) · Lunch served Fri & Sat</span>
                      )}
                    </p>
                  </div>

                  {/* Service Toggle */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium mb-3 font-sans">
                      Service
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                      <button
                        type="button"
                        onClick={() => {
                          const firstDinner =
                            availability?.dinnerSlots?.find((s) => s.isAvailable)?.time ||
                            availability?.dinnerSlots?.[0]?.time ||
                            (isSelectedSunday ? SUNDAY_DINNER_SLOTS[0].time : DINNER_SLOTS[0].time)
                          setValue('service', 'dinner', { shouldValidate: true })
                          setValue('timeSlot', firstDinner, { shouldValidate: true })
                        }}
                        disabled={isSelectedClosedDay}
                        className={`p-3 rounded-md border text-xs tracking-wider uppercase font-medium transition-all font-sans cursor-pointer text-left ${
                          isSelectedClosedDay
                            ? 'bg-[#fcf5df]/10 border-[#e2d7ba]/60 text-[#a0a6b5] cursor-not-allowed opacity-60'
                            : formValues.service === 'dinner'
                            ? 'bg-[#12141a] border-[#12141a] text-[#fcf5df] shadow-sm'
                            : 'bg-[#fcf5df]/40 border-[#d8caa4] text-[#12141a] hover:bg-white'
                        }`}
                      >
                        <span className="block font-bold">
                          {isSelectedSunday ? 'Sunday Supper' : 'Dinner Service'}
                        </span>
                        <span className={`block text-[10px] tracking-normal font-normal mt-0.5 ${
                          formValues.service === 'dinner' ? 'text-[#d8caa4]' : 'text-[#5e6576]'
                        }`}>
                          {isSelectedClosedDay ? 'Closed' : isSelectedSunday ? '17:00 – 22:00' : '17:30 – 23:00'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const firstLunch =
                            availability?.lunchSlots?.find((s) => s.isAvailable)?.time ||
                            availability?.lunchSlots?.[0]?.time ||
                            (isSelectedLunchDay ? LUNCH_SLOTS[0].time : '')
                          setValue('service', 'lunch', { shouldValidate: true })
                          setValue('timeSlot', firstLunch, { shouldValidate: true })
                        }}
                        disabled={isSelectedClosedDay}
                        className={`p-3 rounded-md border text-xs tracking-wider uppercase font-medium transition-all font-sans cursor-pointer text-left ${
                          isSelectedClosedDay
                            ? 'bg-[#fcf5df]/10 border-[#e2d7ba]/60 text-[#a0a6b5] cursor-not-allowed opacity-60'
                            : formValues.service === 'lunch'
                            ? 'bg-[#12141a] border-[#12141a] text-[#fcf5df] shadow-sm'
                            : 'bg-[#fcf5df]/40 border-[#d8caa4] text-[#12141a] hover:bg-white'
                        }`}
                      >
                        <span className="block font-bold">Lunch Service</span>
                        <span className={`block text-[10px] tracking-normal font-normal mt-0.5 ${
                          formValues.service === 'lunch' ? 'text-[#d8caa4]' : 'text-[#5e6576]'
                        }`}>
                          {isSelectedClosedDay ? 'Closed' : isSelectedLunchDay ? '12:00 – 14:30' : 'Fri & Sat only'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium font-sans">
                        Available Sittings
                      </label>
                      <span className="text-[10px] tracking-wider text-[#12141a] flex items-center gap-1.5 font-sans font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCheckingAvailability ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'}`} />
                        {isCheckingAvailability ? 'Syncing capacity...' : 'Live table allocations'}
                      </span>
                    </div>
                    <div aria-live="polite">
                    {isAvailabilityError ? (
                      <ErrorState onRetry={() => { void refetchAvailability() }} />
                    ) : isCheckingAvailability && !availability ? (
                      <div className="rounded-lg border border-[#e2d7ba] bg-[#fcf5df]/40 px-4 py-5 text-sm text-[#5e6576] font-sans">
                        Checking live table availability…
                      </div>
                    ) : availability?.isAvailable === false || isSelectedClosedDay ? (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-5 font-sans">
                        <p className="text-sm text-amber-900 font-medium">No service on this date</p>
                        <p className="text-xs text-amber-800 mt-1">
                          {availability?.message || 'AURA is closed on Mondays & Tuesdays for Highland foraging and cellar curation.'}
                        </p>
                      </div>
                    ) : selectedSlots.length === 0 ? (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5 font-sans">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-950">Lunch Service is only offered on Friday & Saturday</p>
                            <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                              AURA serves lunch exclusively on Friday and Saturday (12:00 – 14:30).
                              On {DAY_NAMES[selectedDayOfWeek] || 'this date'}, we invite you to join our evening service.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                const firstDinner =
                                  availability?.dinnerSlots?.find((s) => s.isAvailable)?.time ||
                                  availability?.dinnerSlots?.[0]?.time ||
                                  (isSelectedSunday ? SUNDAY_DINNER_SLOTS[0].time : DINNER_SLOTS[0].time)
                                setValue('service', 'dinner', { shouldValidate: true })
                                setValue('timeSlot', firstDinner, { shouldValidate: true })
                              }}
                              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#12141a] px-3.5 py-2 text-xs font-semibold text-[#fcf5df] hover:bg-[#2a2e39] transition-colors cursor-pointer"
                            >
                              Switch to Dinner Service →
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="rounded-lg border border-[#e2d7ba] bg-[#fcf5df]/40 px-4 py-5 font-sans">
                        <p className="text-sm text-[#12141a] font-medium">This service is fully booked.</p>
                        <p className="text-xs text-[#5e6576] mt-1">
                          Choose another service or contact our concierge about this date.
                        </p>
                      </div>
                    ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedSlots.map((slot) => {
                        const isSelected = formValues.timeSlot === slot.time
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setValue('timeSlot', slot.time, { shouldValidate: true })}
                            disabled={!slot.isAvailable || isCheckingAvailability}
                            aria-pressed={isSelected}
                            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#12141a] border-[#12141a] text-[#fcf5df] shadow-md'
                                : slot.isAvailable
                                ? 'bg-[#fcf5df]/30 border-[#d8caa4] text-[#12141a] hover:border-[#12141a] hover:bg-white'
                                : 'bg-[#fcf5df]/10 border-[#e2d7ba]/60 text-[#a0a6b5] cursor-not-allowed opacity-60'
                            }`}
                          >
                            <span className="font-serif text-2xl font-normal block leading-tight">{slot.time}</span>
                            <span className={`text-[10px] font-sans tracking-wide ${
                              isSelected
                                ? 'text-[#d8caa4]'
                                : slot.isAvailable
                                ? 'text-[#5e6576]'
                                : 'text-rose-500'
                            }`}>
                              {slot.status}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    )}
                    {errors.timeSlot && (
                      <p id="reservation-timeslot-error" className="text-xs text-rose-500 mt-2 font-sans">{errors.timeSlot.message}</p>
                    )}
                    {errors.service && (
                      <p id="reservation-service-error" className="text-xs text-rose-500 mt-2 font-sans">{errors.service.message}</p>
                    )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Experience & Pairing */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="font-serif text-3xl text-[#12141a] font-normal mb-1">
                      Choose Your Gastronomic Experience
                    </h3>
                    <p className="text-xs text-[#5e6576] font-sans">
                      Every menu is hyper-seasonal, driven by daily forage and catches.
                    </p>
                  </div>

                  {/* Tasting Menus */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium font-sans">
                      Tasting Menu Tier
                    </label>
                    {EXPERIENCES.map((exp) => {
                      const isSelected = formValues.experience === exp.id
                      return (
                        <button
                          type="button"
                          key={exp.id}
                          onClick={() => setValue('experience', exp.id, { shouldValidate: true })}
                          aria-pressed={isSelected}
                          className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-4 text-left w-full ${
                            isSelected
                              ? 'bg-[#fcf5df]/60 border-2 border-[#12141a] shadow-sm'
                              : 'bg-white border border-[#e2d7ba] hover:border-[#12141a]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-serif font-normal text-[#12141a]">
                                {exp.name}
                              </span>
                              <span className="text-[10px] text-[#5e6576] bg-[#fcf5df] border border-[#e2d7ba] px-2 py-0.5 rounded font-sans">
                                {exp.duration}
                              </span>
                            </div>
                            <p className="text-xs text-[#5e6576] font-sans mt-1">{exp.tagline}</p>
                          </div>
                          <span className="font-serif text-xl text-[#12141a] font-medium shrink-0">
                            {formatCurrency(exp.price)} <span className="text-xs font-sans text-[#5e6576]">/ guest</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Wine Pairings */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium font-sans">
                      Sommelier Cellar Pairing
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAIRINGS.map((pair) => {
                        const isSelected = formValues.pairing === pair.id
                        return (
                          <button
                            type="button"
                            key={pair.id}
                            onClick={() => setValue('pairing', pair.id as any, { shouldValidate: true })}
                            aria-pressed={isSelected}
                            className={`p-3.5 rounded-lg border cursor-pointer transition-all text-left ${
                              isSelected
                                ? 'bg-[#fcf5df]/60 border-2 border-[#12141a] shadow-sm'
                                : 'bg-white border border-[#e2d7ba] hover:border-[#12141a]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1 gap-3">
                              <span className="text-base font-serif font-normal text-[#12141a]">
                                {pair.name}
                              </span>
                              <span className="text-xs text-[#12141a] font-semibold font-sans shrink-0">
                                {pair.price > 0 ? `+${formatCurrency(pair.price)}` : 'Included'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5e6576] font-sans">{pair.desc}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Seating Preference */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium mb-3 font-sans">
                      Atmosphere Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'dining-room', label: 'Vault Dining Room' },
                        { id: 'chefs-counter', label: 'Chef’s Atelier Counter' },
                        { id: 'vault-alcove', label: 'Stone Vault Alcove' },
                      ].map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => setValue('seatingPreference', seat.id as any)}
                          className={`p-3 rounded-md border text-xs tracking-wider uppercase font-medium text-center transition-all font-sans cursor-pointer ${
                            formValues.seatingPreference === seat.id
                              ? 'bg-[#12141a] border-[#12141a] text-[#fcf5df] shadow-sm'
                              : 'bg-[#fcf5df]/40 border-[#d8caa4] text-[#12141a] hover:bg-white'
                          }`}
                        >
                          {seat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Guest Details & Policy */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-3xl text-[#12141a] font-normal mb-1">
                      Guest & Dietary Details
                    </h3>
                    <p className="text-xs text-[#5e6576] font-sans">
                      Kindly provide your contact details and any allergen restrictions for our kitchen brigade.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-2 font-medium font-sans">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Lord / Lady / Dr / Mr / Ms..."
                        autoComplete="name"
                        {...register('fullName')}
                        aria-invalid={errors.fullName ? 'true' : 'false'}
                        aria-describedby={errors.fullName ? 'reservation-name-error' : undefined}
                        className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
                      />
                      {errors.fullName && (
                        <p id="reservation-name-error" className="text-[11px] text-rose-500 mt-1 font-sans">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-2 font-medium font-sans">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        autoComplete="email"
                        {...register('email')}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'reservation-email-error' : undefined}
                        className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
                      />
                      {errors.email && (
                        <p id="reservation-email-error" className="text-[11px] text-rose-500 mt-1 font-sans">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-2 font-medium font-sans">
                        Telephone *
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 7123 456789"
                        autoComplete="tel"
                        {...register('phone')}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone ? 'reservation-phone-error' : undefined}
                        className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
                      />
                      {errors.phone && (
                        <p id="reservation-phone-error" className="text-[11px] text-rose-500 mt-1 font-sans">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-2 font-medium font-sans">
                        Special Occasion (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Anniversary, Birthday, Business Salon..."
                        {...register('specialOccasion')}
                        className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-2 font-medium font-sans">
                      Dietary & Allergen Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Please note any allergies (e.g., shellfish, gluten, dairy) or dietary preferences. Our chefs tailor each tasting menu accordingly."
                      {...register('dietaryNotes')}
                      className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none leading-relaxed font-sans"
                    />
                  </div>

                  {/* Terms & Cancellation notice */}
                  <div className="p-4 rounded-lg bg-[#fcf5df]/50 border border-[#e2d7ba] text-[#4a5160] text-xs space-y-3 font-sans">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#12141a] shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">
                        To guarantee fresh procurement from our Highland and coastal foragers, table
                        cancellations require 48 hours notice.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer text-[#12141a] text-xs">
                      <input
                        type="checkbox"
                        {...register('agreeToPolicy')}
                        className="rounded bg-white border-[#d8caa4] text-[#12141a] focus:ring-0"
                      />
                      <span>I understand and accept the 48-hour cancellation policy.</span>
                    </label>
                    {errors.agreeToPolicy && (
                      <p className="text-[11px] text-rose-500">{errors.agreeToPolicy.message}</p>
                    )}

                    {/* Deposit transparency */}
                    <div className="pt-2 border-t border-[#e2d7ba]">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#12141a]">Indicative deposit policy</span>
                        <span className="text-[#12141a] font-bold">£50 × {formValues.guests} guests = £{depositAmount}</span>
                      </div>
                      <p className="text-[10px] text-[#5e6576] pt-0.5">
                        No payment details are collected on this screen. Our concierge will confirm any deposit requirement with your booking.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Actions */}
              {submitError && (
                <div role="alert" className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900 font-sans">
                  {submitError}
                </div>
              )}
              <div className="flex items-center justify-between pt-8 border-t border-[#e2d7ba] mt-8">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous Step
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    onClick={handleNext}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Continue to {currentStep === 1 ? 'Experience' : 'Details'}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="gold"
                    size="md"
                    isLoading={createReservationMutation.isPending}
                    rightIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Confirm Table Booking
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Live Booking Receipt Summary Sidebar */}
          <div className="lg:col-span-4 bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-lg sticky top-28 space-y-6 text-[#12141a]">
            <div className="border-b border-[#e2d7ba] pb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#12141a] font-medium font-sans">
                Summary
              </span>
              <h4 className="font-serif text-2xl text-[#12141a] font-normal mt-1">Your Reservation</h4>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="flex items-center justify-between text-[#4a5160]">
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#12141a]" /> Party Size:
                </span>
                <span className="font-medium text-[#12141a]">{formValues.guests} Guests</span>
              </div>

              <div className="flex items-center justify-between text-[#4a5160]">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#12141a]" /> Date:
                </span>
                <span className="font-medium text-[#12141a]">
                  {formatDateDisplay(formValues.date) || 'Select a date'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#4a5160]">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#12141a]" /> Sitting:
                </span>
                <span className="font-medium text-[#12141a] text-right">
                  {isSelectedClosedDay ? (
                    <span className="text-amber-700">Closed</span>
                  ) : formValues.timeSlot ? (
                    `${formValues.timeSlot} (${
                      isSelectedSunday && formValues.service === 'dinner'
                        ? 'Sunday Supper'
                        : formValues.service === 'lunch'
                        ? 'Lunch'
                        : 'Dinner'
                    })`
                  ) : formValues.service === 'lunch' && !isSelectedLunchDay ? (
                    <span className="text-amber-700">Fri & Sat only</span>
                  ) : (
                    <span className="text-[#8890a0]">Not selected</span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#4a5160] pt-2 border-t border-[#e2d7ba]">
                <span className="flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-[#12141a]" /> Menu:
                </span>
                <span className="font-serif text-[#12141a] text-right text-sm">
                  {selectedExpObj.name.split('(')[0]}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#4a5160]">
                <span className="flex items-center gap-2">
                  <Wine className="w-3.5 h-3.5 text-[#12141a]" /> Wine Pairing:
                </span>
                <span className="text-right text-[11px] text-[#12141a] font-medium">{selectedPairObj.name}</span>
              </div>
            </div>

            {/* Itemized total calculation */}
            <div className="pt-4 border-t border-[#e2d7ba]">
              <div className="space-y-2 text-xs text-[#5e6576] mb-3 font-sans">
                <div className="flex items-center justify-between">
                  <span>{selectedExpObj.name.split('(')[0]} × {formValues.guests}</span>
                  <span className="text-[#12141a] font-medium">{formatCurrency((selectedExpObj?.price || 0) * (formValues.guests || 2))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{selectedPairObj.name} × {formValues.guests}</span>
                  <span className="text-[#12141a] font-medium">{formatCurrency((selectedPairObj?.price || 0) * (formValues.guests || 2))}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-base font-serif text-[#12141a] font-medium">
                <span>Total Estimated:</span>
                <span className="text-[#12141a] text-2xl font-serif font-bold">
                  {formatCurrency(totalEstimate)}
                </span>
              </div>
              <p className="text-[10px] text-[#5e6576] mt-2 italic leading-relaxed font-sans">
                Estimate shown per guest selections. Payment is settled in the dining room at the conclusion of service.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
