import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { reservationSchema, type ReservationFormInput } from '@/lib/validations'
import { useCreateReservation, useAvailability } from '@/hooks/useDishes'
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
} from 'lucide-react'

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

const LUNCH_SLOTS = [
  { time: '12:00', status: 'Available', isAvailable: true },
  { time: '12:45', status: 'Available', isAvailable: true },
  { time: '13:15', status: 'Few tables left', isAvailable: true },
]

export const ReservationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null)
  const { toast } = useToast()
  const createReservationMutation = useCreateReservation()

  // Pre-fill tomorrow's date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDateStr = tomorrow.toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ReservationFormInput>({
    resolver: zodResolver(reservationSchema),
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
      agreeToPolicy: true,
    },
  })

  const formValues = watch()
  const { data: availability, isLoading: isCheckingAvailability } = useAvailability(
    formValues.date,
    formValues.guests
  )

  // Calculate live tally
  const selectedExpObj = EXPERIENCES.find((e) => e.id === formValues.experience) || EXPERIENCES[0]
  const selectedPairObj = PAIRINGS.find((p) => p.id === formValues.pairing) || PAIRINGS[0]
  const pricePerGuest = (selectedExpObj?.price || 0) + (selectedPairObj?.price || 0)
  const totalEstimate = pricePerGuest * (formValues.guests || 2)
  const depositAmount = (formValues.guests || 2) * 50 // £50 deposit per guest

  const selectedSlots = useMemo(
    () => formValues.service === 'dinner'
      ? (availability ? availability.dinnerSlots : DINNER_SLOTS)
      : (availability ? availability.lunchSlots : LUNCH_SLOTS),
    [availability, formValues.service]
  )

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

  const validateStep = async (step: number) => {
    if (step === 1) {
      return await trigger(['guests', 'date', 'service', 'timeSlot'])
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
      })

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#f5eed8', '#dfc783'],
      })

      setConfirmedBooking(result)
      toast({
        title: 'Reservation Confirmed',
        message: `Booking #${result.confirmationCode} has been secured. A confirmation email was sent to ${data.email}.`,
        type: 'success',
      })
    } catch {
      toast({
        title: 'Booking Error',
        message: 'Unable to process your reservation. Please try again or call us directly.',
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
          className="bg-[#0e1017] border border-[#c5a059]/40 rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="w-14 h-14 rounded-full bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center mx-auto mb-4 text-[#c5a059]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-sans font-medium">
              Reservation Confirmed
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mt-2 mb-4">
              We Look Forward to Welcoming You
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Your table at AURA Edinburgh is confirmed. An electronic invitation containing directions
              and dietary verification has been dispatched to{' '}
              <span className="text-white font-medium">{confirmedBooking.email}</span>.
            </p>
          </div>

          {/* Digital Voucher Card */}
          <div className="bg-[#141722] border border-stone-800 rounded-lg p-6 sm:p-8 max-w-xl mx-auto mb-8 relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
              <div>
                <span className="font-serif text-xl tracking-[0.2em] text-white uppercase">
                  A U R A
                </span>
                <span className="block text-[10px] text-stone-500 uppercase tracking-widest">
                  Edinburgh • 2 Michelin Stars
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest block">
                  Reference Code
                </span>
                <span className="font-mono text-[#c5a059] font-bold text-sm tracking-wider">
                  {confirmedBooking.confirmationCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase tracking-wider">Date</span>
                <span className="text-stone-200 font-medium">{confirmedBooking.date}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase tracking-wider">Sitting</span>
                <span className="text-stone-200 font-medium">
                  {confirmedBooking.timeSlot} ({confirmedBooking.service})
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase tracking-wider">Party Size</span>
                <span className="text-stone-200 font-medium">{confirmedBooking.guests} Guests</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-stone-500 block text-[10px] uppercase tracking-wider">Experience</span>
                <span className="text-stone-200 font-medium">{confirmedBooking.experience}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase tracking-wider">Estimated Total</span>
                <span className="text-[#c5a059] font-serif text-base font-semibold">
                  {formatCurrency(confirmedBooking.totalEstimate)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Guest: {confirmedBooking.fullName}</span>
              <span>14–16 Royal Terrace Vaults, EH7 5TB</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConfirmedBooking(null)
                setCurrentStep(1)
              }}
            >
              Make Another Reservation
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() => window.print()}
            >
              Print Confirmation Voucher
            </Button>
          </div>
        </motion.div>
      ) : (
        /* Multi-step Form Wizard */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Form */}
          <div className="lg:col-span-8 bg-[#0e1017]/95 border border-stone-800 rounded-xl p-6 sm:p-10 shadow-2xl">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-800/80">
              {[
                { step: 1, label: 'Date & Time' },
                { step: 2, label: 'Experience' },
                { step: 3, label: 'Guest Details' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      currentStep === s.step
                        ? 'bg-[#c5a059] text-black font-semibold shadow-md shadow-[#c5a059]/20'
                        : currentStep > s.step
                        ? 'bg-stone-800 text-[#c5a059]'
                        : 'bg-stone-900 text-stone-500 border border-stone-800'
                    }`}
                  >
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider hidden sm:inline ${
                      currentStep === s.step ? 'text-white font-medium' : 'text-stone-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* STEP 1: Guests, Date, Service, Time */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="font-serif text-2xl text-white font-light mb-1">
                      Select Party & Sittings
                    </h3>
                    <p className="text-xs text-stone-400">
                      Choose your party size, preferred dining date, and table service time.
                    </p>
                  </div>

                  {/* Guests Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-3">
                      Number of Guests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setValue('guests', num, { shouldValidate: true })}
                          className={`w-11 h-11 rounded-md text-xs font-medium font-sans transition-all ${
                            formValues.guests === num
                              ? 'bg-[#c5a059] text-black font-bold shadow-md shadow-[#c5a059]/20'
                              : 'bg-[#141720] text-stone-300 border border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {errors.guests && (
                      <p className="text-xs text-rose-400 mt-2">{errors.guests.message}</p>
                    )}
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-3">
                      Reservation Date
                    </label>
                    <div className="relative max-w-sm">
                      <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('date')}
                        className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md pl-10 pr-4 py-3 text-xs text-white focus:outline-none cursor-pointer"
                      />
                    </div>
                    {errors.date && (
                      <p className="text-xs text-rose-400 mt-2">{errors.date.message}</p>
                    )}
                  </div>

                  {/* Service Toggle */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-3">
                      Service
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setValue('service', 'dinner', { shouldValidate: true })
                          setValue('timeSlot', DINNER_SLOTS[0].time)
                        }}
                        className={`p-3 rounded-md border text-xs tracking-wider uppercase font-medium transition-all ${
                          formValues.service === 'dinner'
                            ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                            : 'bg-[#141720] border-stone-800 text-stone-400'
                        }`}
                      >
                        Dinner Service
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setValue('service', 'lunch', { shouldValidate: true })
                          setValue('timeSlot', LUNCH_SLOTS[0].time)
                        }}
                        className={`p-3 rounded-md border text-xs tracking-wider uppercase font-medium transition-all ${
                          formValues.service === 'lunch'
                            ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                            : 'bg-[#141720] border-stone-800 text-stone-400'
                        }`}
                      >
                        Lunch Service
                      </button>
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium">
                        Available Sittings
                      </label>
                      <span className="text-[10px] tracking-wider text-[#c5a059] flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCheckingAvailability ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                        {isCheckingAvailability ? 'Syncing capacity...' : 'Live table allocations'}
                      </span>
                    </div>
                    <div aria-live="polite">
                    {isCheckingAvailability ? (
                      <div className="rounded-lg border border-stone-800 bg-[#141720] px-4 py-5 text-sm text-stone-400">
                        Checking live table availability…
                      </div>
                    ) : availability?.isAvailable === false ? (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-5">
                        <p className="text-sm text-amber-100">No service on this date</p>
                        <p className="text-xs text-amber-200/70 mt-1">
                          {availability.message || 'Please choose another date to continue.'}
                        </p>
                      </div>
                    ) : selectedSlots.length === 0 ? (
                      <div className="rounded-lg border border-stone-800 bg-[#141720] px-4 py-5 text-sm text-stone-400">
                        Lunch service is not available on this date. Try Friday or Saturday dinner.
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="rounded-lg border border-stone-800 bg-[#141720] px-4 py-5">
                        <p className="text-sm text-stone-200">This service is fully booked.</p>
                        <p className="text-xs text-stone-500 mt-1">
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
                            disabled={!slot.isAvailable}
                            aria-pressed={isSelected}
                            className={`p-3.5 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'bg-[#c5a059]/15 border-[#c5a059] text-white shadow-sm shadow-[#c5a059]/20'
                                : slot.isAvailable
                                ? 'bg-[#141720] border-stone-800 text-stone-300 hover:border-stone-700'
                                : 'bg-[#101217] border-stone-900 text-stone-600 cursor-not-allowed'
                            }`}
                          >
                            <span className="font-serif text-lg font-medium block">{slot.time}</span>
                            <span className={`text-[10px] font-sans tracking-wide ${slot.isAvailable ? 'text-stone-500' : 'text-rose-400/70'}`}>
                              {slot.status}
                            </span>
                          </button>
                        )
                      })}
                    </div>
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
                    <h3 className="font-serif text-2xl text-white font-light mb-1">
                      Choose Your Gastronomic Experience
                    </h3>
                    <p className="text-xs text-stone-400">
                      Every menu is hyper-seasonal, driven by daily forage and catches.
                    </p>
                  </div>

                  {/* Tasting Menus */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium">
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
                          className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                            isSelected
                              ? 'bg-[#c5a059]/10 border-[#c5a059]'
                              : 'bg-[#141720] border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-serif font-medium text-white">
                                {exp.name}
                              </span>
                              <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                                {exp.duration}
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 font-light mt-1">{exp.tagline}</p>
                          </div>
                          <span className="font-serif text-base text-[#c5a059] font-medium shrink-0">
                            {formatCurrency(exp.price)} / guest
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Wine Pairings */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium">
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
                                ? 'bg-[#c5a059]/10 border-[#c5a059]'
                                : 'bg-[#141720] border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1 gap-3">
                              <span className="text-xs font-serif font-medium text-white">
                                {pair.name}
                              </span>
                              <span className="text-xs text-[#c5a059] font-medium shrink-0">
                                {pair.price > 0 ? `+${formatCurrency(pair.price)}` : 'Included'}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 font-light">{pair.desc}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Seating Preference */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-3">
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
                          className={`p-3 rounded-md border text-xs tracking-wider uppercase font-medium text-center transition-all ${
                            formValues.seatingPreference === seat.id
                              ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                              : 'bg-[#141720] border-stone-800 text-stone-400'
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
                    <h3 className="font-serif text-2xl text-white font-light mb-1">
                      Guest & Dietary Details
                    </h3>
                    <p className="text-xs text-stone-400">
                      Kindly provide your contact details and any allergen restrictions for our kitchen brigade.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-300 mb-2 font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Lord / Lady / Dr / Mr / Ms..."
                        {...register('fullName')}
                        className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-300 mb-2 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        {...register('email')}
                        className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-300 mb-2 font-medium">
                        Telephone *
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 7123 456789"
                        {...register('phone')}
                        className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-300 mb-2 font-medium">
                        Special Occasion (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Anniversary, Birthday, Business Salon..."
                        {...register('specialOccasion')}
                        className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-300 mb-2 font-medium">
                      Dietary & Allergen Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Please note any allergies (e.g., shellfish, gluten, dairy) or dietary preferences. Our chefs tailor each tasting menu accordingly."
                      {...register('dietaryNotes')}
                      className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Terms & Cancellation notice */}
                  <div className="p-4 rounded-lg bg-[#141722] border border-stone-800/80 text-stone-400 text-xs space-y-3">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">
                        To guarantee fresh procurement from our Highland and coastal foragers, table
                        cancellations require 48 hours notice.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer text-stone-300 text-xs">
                      <input
                        type="checkbox"
                        {...register('agreeToPolicy')}
                        className="rounded bg-stone-900 border-stone-700 text-[#c5a059] focus:ring-0"
                      />
                      <span>I understand and accept the 48-hour cancellation policy.</span>
                    </label>
                    {errors.agreeToPolicy && (
                      <p className="text-[11px] text-rose-400">{errors.agreeToPolicy.message}</p>
                    )}

                    {/* Deposit transparency */}
                    <div className="pt-2 border-t border-stone-800/60">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-stone-300">Indicative deposit policy</span>
                        <span className="text-[#c5a059] font-medium">£50 × {formValues.guests} guests = £{depositAmount}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 pt-0.5">
                        No payment details are collected on this screen. Our concierge will confirm any deposit requirement with your booking.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-8 border-t border-stone-800 mt-8">
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
          <div className="lg:col-span-4 bg-[#0e1017]/90 border border-stone-800 rounded-xl p-6 shadow-xl sticky top-28 space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a059] font-medium font-sans">
                Summary
              </span>
              <h4 className="font-serif text-xl text-white font-light mt-1">Your Reservation</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#c5a059]" /> Party Size:
                </span>
                <span className="font-medium text-white">{formValues.guests} Guests</span>
              </div>

              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#c5a059]" /> Date:
                </span>
                <span className="font-medium text-white">{formValues.date || 'Tomorrow'}</span>
              </div>

              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#c5a059]" /> Time:
                </span>
                <span className="font-medium text-white">
                  {formValues.timeSlot} ({formValues.service})
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-300 pt-2 border-t border-stone-800/80">
                <span className="flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-[#c5a059]" /> Menu:
                </span>
                <span className="font-serif text-stone-200 text-right text-[11px]">
                  {selectedExpObj.name.split('(')[0]}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <Wine className="w-3.5 h-3.5 text-[#c5a059]" /> Wine Pairing:
                </span>
                <span className="text-right text-[11px] text-stone-200">{selectedPairObj.name}</span>
              </div>
            </div>

            {/* Itemized total calculation */}
            <div className="pt-4 border-t border-stone-800">
              <div className="space-y-2 text-xs text-stone-400 mb-3">
                <div className="flex items-center justify-between">
                  <span>{selectedExpObj.name.split('(')[0]} × {formValues.guests}</span>
                  <span>{formatCurrency((selectedExpObj?.price || 0) * (formValues.guests || 2))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{selectedPairObj.name} × {formValues.guests}</span>
                  <span>{formatCurrency((selectedPairObj?.price || 0) * (formValues.guests || 2))}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-base font-serif text-white font-medium">
                <span>Total Estimated:</span>
                <span className="text-[#c5a059] text-xl font-serif">
                  {formatCurrency(totalEstimate)}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 mt-2 italic leading-relaxed">
                Estimate shown per guest selections. Payment is settled in the dining room at the conclusion of service.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
