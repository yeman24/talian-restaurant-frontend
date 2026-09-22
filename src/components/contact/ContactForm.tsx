import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormInput } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/common/Button'
import { Send } from 'lucide-react'
import { useSubmitContact } from '@/hooks/useDishes'

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
  const contactMutation = useSubmitContact()

  const selectedInquiry = watch('inquiryType')

  const onSubmit = async (data: ContactFormInput) => {
    try {
      await contactMutation.mutateAsync(data)
      toast({
        title: 'Inquiry Transmitted',
        message: `Thank you, ${data.name}. Our Maître d’ will respond to ${data.email} within 12 hours.`,
        type: 'success',
      })
      reset()
    } catch (error) {
      toast({
        title: 'Inquiry Unavailable',
        message: error instanceof Error ? error.message : 'Please try again shortly.',
        type: 'error',
      })
    }
  }

  return (
    <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 sm:p-10 shadow-lg text-[#12141a]">
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#12141a] font-medium font-sans">
          Direct Concierge
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#12141a] font-normal mt-1 mb-2">
          Send an Inquiry
        </h3>
        <p className="text-xs text-[#5e6576] leading-relaxed font-sans">
          Whether arranging a private celebration in our historic cellar or requesting sommelier
          provenance notes, our team is at your disposal.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Inquiry Type Buttons */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#12141a] font-medium mb-3 font-sans">
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
                className={`text-center p-3 rounded-md border text-xs tracking-wider uppercase font-medium cursor-pointer transition-all font-sans ${
                  selectedInquiry === type.id
                    ? 'bg-[#12141a] border-[#12141a] text-[#fcf5df] shadow-sm'
                    : 'bg-[#fcf5df]/40 border-[#d8caa4] text-[#12141a] hover:bg-white'
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
          <div className="p-4 rounded-lg bg-[#fcf5df]/50 border border-[#e2d7ba] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-1.5 font-medium font-sans">
                Approximate Guest Count
              </label>
              <input
                type="number"
                placeholder="Up to 14 guests"
                {...register('guestsCount', { valueAsNumber: true })}
                className="w-full bg-white border border-[#d8caa4] rounded px-3 py-2 text-xs text-[#12141a] focus:border-[#12141a] focus:outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-1.5 font-medium font-sans">
                Preferred Date
              </label>
              <input
                type="date"
                {...register('preferredDate')}
                className="w-full bg-white border border-[#d8caa4] rounded px-3 py-2 text-xs text-[#12141a] focus:border-[#12141a] focus:outline-none font-sans"
              />
            </div>
          </div>
        )}

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-1.5 font-medium font-sans">
              Your Name *
            </label>
            <input
              type="text"
              placeholder="Lord / Lady / Dr / Mr / Ms..."
              {...register('name')}
              className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 mt-1 font-sans">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-1.5 font-medium font-sans">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="you@domain.com"
              {...register('email')}
              className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
            />
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1 font-sans">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-1.5 font-medium font-sans">
            Contact Telephone (Optional)
          </label>
          <input
            type="tel"
            placeholder="+44 7123 456789"
            {...register('phone')}
            className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#12141a] mb-1.5 font-medium font-sans">
            Your Message *
          </label>
          <textarea
            rows={4}
            placeholder="Please detail your request or special preferences..."
            {...register('message')}
            className="w-full bg-[#fcf5df]/30 border border-[#d8caa4] focus:border-[#12141a] rounded-md px-3.5 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none leading-relaxed font-sans"
          />
          {errors.message && (
            <p className="text-[11px] text-rose-500 mt-1 font-sans">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="gold"
          size="md"
          isLoading={isSubmitting || contactMutation.isPending}
          rightIcon={<Send className="w-3.5 h-3.5" />}
          className="w-full justify-center tracking-[0.2em]"
        >
          Transmit Message
        </Button>
      </form>
    </div>
  )
}
