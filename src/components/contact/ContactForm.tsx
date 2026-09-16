import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormInput } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/common/Button'
import { Send } from 'lucide-react'

export const ContactForm: React.FC = () => {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: 'general',
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  })

  const selectedInquiry = watch('inquiryType')

  const onSubmit = async (data: ContactFormInput) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast({
      title: 'Inquiry Transmitted',
      message: `Thank you, ${data.name}. Our Maître d’ will respond to ${data.email} within 12 hours.`,
      type: 'success',
    })
    reset()
  }

  return (
    <div className="bg-[#0e1017] border border-stone-800 rounded-xl p-6 sm:p-10 shadow-2xl">
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a059] font-medium font-sans">
          Direct Concierge
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-white font-light mt-1 mb-2">
          Send an Inquiry
        </h3>
        <p className="text-xs text-stone-400 leading-relaxed font-light">
          Whether arranging a private celebration in our historic cellar or requesting sommelier
          provenance notes, our team is at your disposal.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Inquiry Type Buttons */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-3">
            Inquiry Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'general', label: 'General' },
              { id: 'private-dining', label: 'Private Cellar' },
              { id: 'cellar-master', label: 'Sommelier' },
              { id: 'press', label: 'Press & Media' },
            ].map((type) => (
              <label
                key={type.id}
                className={`text-center p-3 rounded-md border text-xs tracking-wider uppercase font-medium cursor-pointer transition-all ${
                  selectedInquiry === type.id
                    ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                    : 'bg-[#141720] border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <input
                  type="radio"
                  value={type.id}
                  {...register('inquiryType')}
                  className="sr-only"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Private Dining Fields */}
        {selectedInquiry === 'private-dining' && (
          <div className="p-4 rounded-lg bg-[#141722] border border-[#c5a059]/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-300 mb-1.5 font-medium">
                Approximate Guest Count
              </label>
              <input
                type="number"
                placeholder="Up to 14 guests"
                {...register('guestsCount', { valueAsNumber: true })}
                className="w-full bg-[#0a0c10] border border-stone-800 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-300 mb-1.5 font-medium">
                Preferred Date
              </label>
              <input
                type="date"
                {...register('preferredDate')}
                className="w-full bg-[#0a0c10] border border-stone-800 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-300 mb-1.5 font-medium">
              Your Name *
            </label>
            <input
              type="text"
              placeholder="Lord / Lady / Dr / Mr / Ms..."
              {...register('name')}
              className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-300 mb-1.5 font-medium">
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
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-300 mb-1.5 font-medium">
            Contact Telephone (Optional)
          </label>
          <input
            type="tel"
            placeholder="+44 7123 456789"
            {...register('phone')}
            className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-300 mb-1.5 font-medium">
            Your Message *
          </label>
          <textarea
            rows={4}
            placeholder="Please detail your request or special preferences..."
            {...register('message')}
            className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none leading-relaxed"
          />
          {errors.message && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="gold"
          size="md"
          isLoading={isSubmitting}
          rightIcon={<Send className="w-3.5 h-3.5" />}
          className="w-full justify-center tracking-[0.2em]"
        >
          Transmit Message
        </Button>
      </form>
    </div>
  )
}
