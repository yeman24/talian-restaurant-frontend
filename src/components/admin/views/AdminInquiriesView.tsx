import React, { useMemo, useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { useAdminInquiries, useUpdateInquiryStatus } from '@/hooks/useDishes'
import type { InquiryStatus } from '@/types'

type Filter = 'ALL' | InquiryStatus

const typeLabels: Record<string, string> = {
  GENERAL: 'General enquiry',
  PRIVATE_DINING: 'Private dining',
  CELLAR_MASTER: 'Cellar master',
  PRESS: 'Press enquiry',
}

export const AdminInquiriesView: React.FC = () => {
  const { toast } = useToast()
  const [filter, setFilter] = useState<Filter>('ALL')
  const { data, isLoading, isError, refetch } = useAdminInquiries(filter === 'ALL' ? undefined : filter)
  const updateMutation = useUpdateInquiryStatus()
  const inquiries = useMemo(() => data?.data || [], [data])

  const updateStatus = async (id: string, status: 'IN_PROGRESS' | 'RESOLVED') => {
    try {
      await updateMutation.mutateAsync({ id, status })
      toast({ title: 'Inquiry Updated', message: 'The live inquiry status was synchronized.', type: 'success' })
    } catch (error) {
      toast({ title: 'Update Failed', message: error instanceof Error ? error.message : 'Could not update this inquiry.', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif text-2xl text-[#12141a] font-normal">VIP & Vault Inquiries</h3>
          <p className="text-xs text-stone-500 font-light mt-0.5">Live customer messages from the concierge inbox.</p>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'UNREAD', 'IN_PROGRESS', 'RESOLVED'] as const).map((status) => (
            <button key={status} type="button" onClick={() => setFilter(status)} className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors ${filter === status ? 'bg-[#12141a] text-[#fcf5df] font-bold' : 'bg-[#fcf5df] text-[#12141a] hover:bg-[#f3e6c6] border border-[#dcd2b7]'}`}>
              {status === 'IN_PROGRESS' ? 'In progress' : status}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="rounded-xl border border-[#e2d7ba] bg-white p-8 text-sm text-stone-600">Loading live inquiries…</div>}
      {isError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">Unable to load live inquiries. <button type="button" onClick={() => void refetch()} className="font-semibold underline">Try again</button></div>}
      {!isLoading && !isError && inquiries.length === 0 && <div className="rounded-xl border border-[#e2d7ba] bg-white p-8 text-sm text-stone-600">No inquiries match this filter.</div>}

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className={`p-6 rounded-xl border transition-all ${inquiry.status === 'UNREAD' ? 'bg-white border-[#12141a] shadow-md' : 'bg-white border-[#e2d7ba] shadow-sm'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="font-serif text-lg text-[#12141a] font-medium">{inquiry.name}</h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-[#fcf5df] text-[#12141a] border border-[#dcd2b7]">{inquiry.status}</span>
                  <time dateTime={inquiry.createdAt} className="text-[10px] text-stone-500 font-mono">{new Date(inquiry.createdAt).toLocaleString()}</time>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 font-mono pt-0.5">
                  <span className="text-[#12141a] font-sans font-semibold">{typeLabels[inquiry.inquiryType] || inquiry.inquiryType}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inquiry.email}</span>
                  {inquiry.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inquiry.phone}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {inquiry.status !== 'RESOLVED' && <button type="button" disabled={updateMutation.isPending} onClick={() => void updateStatus(inquiry.id, 'RESOLVED')} className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#12141a] hover:bg-[#222736] text-[#fcf5df] disabled:opacity-50">Resolve</button>}
                {inquiry.status === 'UNREAD' && <button type="button" disabled={updateMutation.isPending} onClick={() => void updateStatus(inquiry.id, 'IN_PROGRESS')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#12141a] hover:bg-[#f2e6c8] bg-[#fcf5df] border border-[#dcd2b7] disabled:opacity-50">Start</button>}
              </div>
            </div>
            <p className="mt-4 text-xs text-[#12141a] font-light leading-relaxed bg-[#fcf5df] p-4 rounded-lg border border-[#e2d7ba]">{inquiry.message}</p>
            {inquiry.replyNotes && <p className="mt-3 text-xs text-stone-600">Staff notes: {inquiry.replyNotes}</p>}
          </article>
        ))}
      </div>
    </div>
  )
}
