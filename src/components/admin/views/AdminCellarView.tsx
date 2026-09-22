import React from 'react'
import { Wine } from 'lucide-react'
import { useCellarItems } from '@/hooks/useDishes'

export const AdminCellarView: React.FC = () => {
  const { data: items, isLoading, isError, refetch } = useCellarItems()

  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Wine className="w-5 h-5 text-[#12141a]" />
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#12141a] font-bold">Live cellar inventory</span>
        </div>
        <h3 className="font-serif text-2xl text-[#12141a] font-normal">Royal Terrace Cellar</h3>
        <p className="text-xs text-stone-500 font-light mt-1">Inventory shown here is sourced from the operations database.</p>
      </div>

      {isLoading && <div className="rounded-xl border border-[#e2d7ba] bg-white p-8 text-sm text-stone-600">Loading live cellar inventory…</div>}
      {isError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">Unable to load cellar inventory. <button type="button" onClick={() => void refetch()} className="font-semibold underline">Try again</button></div>}
      {!isLoading && !isError && !items?.length && <div className="rounded-xl border border-[#e2d7ba] bg-white p-8 text-sm text-stone-600">No cellar inventory has been entered yet.</div>}

      <div className="space-y-4">
        {items?.map((item) => (
          <article key={item.id} className="p-4 rounded-xl bg-white border border-[#e2d7ba] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-serif text-base text-[#12141a] font-medium">{item.name}</h4>
              <p className="text-xs text-stone-600">{item.region || 'Region not recorded'}{item.vintage ? ` • Vintage ${item.vintage}` : ''}</p>
              {item.pairingWith && <p className="text-xs text-[#12141a]">Paired with: <em>{item.pairingWith}</em></p>}
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-[#12141a] font-bold">{item.stockBottles} bottles</span>
              {item.temperatureZone && <span className="text-stone-600">{item.temperatureZone}</span>}
              {item.allocationStatus && <span className="px-3 py-1 rounded bg-[#fcf5df] border border-[#dcd2b7] text-[#12141a] font-semibold">{item.allocationStatus}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
