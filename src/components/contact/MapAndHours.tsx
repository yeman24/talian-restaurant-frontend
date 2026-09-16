import React from 'react'
import { RESTAURANT_INFO } from '@/data/mockData'
import { MapPin, Phone, Mail, Clock, ExternalLink, Sparkles } from 'lucide-react'

export const MapAndHours: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Google Maps Visual Interactive Placeholder */}
      <div className="bg-[#0e1017] border border-stone-800 rounded-xl overflow-hidden shadow-2xl relative">
        <div className="relative aspect-[16/9] w-full bg-stone-900 overflow-hidden">
          {/* Stylized Dark Map Graphic Background */}
          <div className="absolute inset-0 bg-[#12151c] flex items-center justify-center">
            {/* Map Grid and topography lines representation */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-stone-900 via-transparent to-stone-800" />

            {/* Roads & River Forth / Edinburgh contours representation */}
            <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M-50,80 Q200,60 450,140 T900,100"
                fill="none"
                stroke="#c5a059"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M100,-20 Q300,200 600,400"
                fill="none"
                stroke="#3a4254"
                strokeWidth="2"
              />
              <path
                d="M400,0 Q350,220 300,400"
                fill="none"
                stroke="#3a4254"
                strokeWidth="3"
              />
              <circle cx="340" cy="180" r="40" fill="#c5a059" fillOpacity="0.08" />
              <circle cx="340" cy="180" r="90" fill="#c5a059" fillOpacity="0.03" />
            </svg>

            {/* Custom Luxury Map Pin */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="w-10 h-10 rounded-full bg-[#c5a059] text-black flex items-center justify-center shadow-lg shadow-[#c5a059]/40 border-2 border-white">
                <MapPin className="w-5 h-5 fill-current" />
              </div>
              <div className="w-2.5 h-1 bg-black/60 rounded-full blur-[1px] mt-1" />
            </div>
          </div>

          {/* Map Information Badge overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#08090c]/90 backdrop-blur-md border border-stone-800 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <p className="text-white text-xs font-serif font-medium tracking-wide">
                14–16 Royal Terrace Vaults
              </p>
              <p className="text-[11px] text-stone-400">
                Edinburgh, Scotland EH7 5TB • Calton Hill district
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_INFO.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-[#c5a059] hover:text-white font-sans transition-colors bg-[#141722] px-3 py-1.5 rounded border border-stone-800 hover:border-[#c5a059]"
            >
              <span>Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Service Hours Schedule */}
      <div className="bg-[#0e1017] border border-stone-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800">
          <Clock className="w-4 h-4 text-[#c5a059]" />
          <h4 className="font-serif text-lg text-white font-light">Hours of Gastronomy</h4>
        </div>

        <div className="space-y-4 text-xs">
          {RESTAURANT_INFO.hours.map((h, i) => (
            <div key={i} className="flex items-start justify-between py-1.5 border-b border-stone-900 last:border-0">
              <div>
                <span className="text-stone-200 font-medium block">{h.days}</span>
                <span className="text-[11px] text-[#c5a059]">{h.service}</span>
              </div>
              <div className="text-right">
                <span className="text-stone-300 font-mono block">{h.times}</span>
                {h.lastSitting !== '-' && (
                  <span className="text-[10px] text-stone-500">Last sitting {h.lastSitting}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concierge & Arrival Guidance */}
      <div className="bg-[#0e1017] border border-stone-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-stone-800">
          <Sparkles className="w-4 h-4 text-[#c5a059]" />
          <h4 className="font-serif text-lg text-white font-light">Concierge & Arrival</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-3 p-3 bg-[#141720] rounded-lg border border-stone-800/80">
            <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
            <a href={`tel:${RESTAURANT_INFO.phone.replace(/[^+\d]/g, '')}`} className="group">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Telephone</span>
              <span className="font-mono text-white group-hover:text-[#c5a059] transition-colors">{RESTAURANT_INFO.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#141720] rounded-lg border border-stone-800/80">
            <Mail className="w-4 h-4 text-[#c5a059] shrink-0" />
            <a href={`mailto:${RESTAURANT_INFO.email}`} className="group">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Reservations</span>
              <span className="text-white truncate block group-hover:text-[#c5a059] transition-colors">{RESTAURANT_INFO.email}</span>
            </a>
          </div>
        </div>

        <div className="p-3 bg-[#12141c] rounded-lg border border-stone-800/60 text-[11px] text-stone-400 space-y-1 leading-relaxed">
          <p className="font-medium text-stone-300">Dress Code & Access:</p>
          <p>
            Smart elegant attire is requested. Private discreet valet parking is available on Royal
            Terrace upon advance request with our Maître d’.
          </p>
        </div>
      </div>
    </div>
  )
}
