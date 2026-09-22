import React from 'react'
import { RESTAURANT_INFO } from '@/data/mockData'
import { MapPin, Phone, Mail, Clock, ExternalLink, Sparkles } from 'lucide-react'

export const MapAndHours: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Google Maps Visual Interactive Placeholder */}
      <div className="bg-white border border-[#e2d7ba] rounded-xl overflow-hidden shadow-lg relative">
        <div className="relative aspect-[16/9] w-full bg-[#f6eed2] overflow-hidden">
          {/* Stylized Parchment Map Graphic Background */}
          <div className="absolute inset-0 bg-[#f8f1de] flex items-center justify-center">
            {/* Map Grid and topography lines representation */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#12141a_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-[#e2d7ba] via-transparent to-[#fcf5df]" />

            {/* Roads & River Forth / Edinburgh contours representation */}
            <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M-50,80 Q200,60 450,140 T900,100"
                fill="none"
                stroke="#12141a"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M100,-20 Q300,200 600,400"
                fill="none"
                stroke="#8c7e5e"
                strokeWidth="2"
              />
              <path
                d="M400,0 Q350,220 300,400"
                fill="none"
                stroke="#8c7e5e"
                strokeWidth="3"
              />
              <circle cx="340" cy="180" r="40" fill="#12141a" fillOpacity="0.06" />
              <circle cx="340" cy="180" r="90" fill="#12141a" fillOpacity="0.03" />
            </svg>

            {/* Custom Luxury Map Pin */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="w-10 h-10 rounded-full bg-[#12141a] text-[#fcf5df] flex items-center justify-center shadow-lg border-2 border-[#fcf5df]">
                <MapPin className="w-5 h-5 fill-current" />
              </div>
              <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px] mt-1" />
            </div>
          </div>

          {/* Map Information Badge overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-[#e2d7ba] rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[#12141a] text-xs font-serif font-medium tracking-wide">
                14–16 Royal Terrace Vaults
              </p>
              <p className="text-[11px] text-[#5e6576] font-sans">
                Edinburgh, Scotland EH7 5TB • Calton Hill district
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_INFO.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-[#12141a] hover:text-black font-sans transition-colors bg-[#fcf5df] px-3 py-1.5 rounded border border-[#d8caa4] hover:border-[#12141a]"
            >
              <span>Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Service Hours Schedule */}
      <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-lg text-[#12141a]">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e2d7ba]">
          <Clock className="w-4 h-4 text-[#12141a]" />
          <h4 className="font-serif text-2xl text-[#12141a] font-normal">Hours of Gastronomy</h4>
        </div>

        <div className="space-y-4 text-xs font-sans">
          {RESTAURANT_INFO.hours.map((h, i) => (
            <div key={i} className="flex items-start justify-between py-1.5 border-b border-[#e2d7ba]/60 last:border-0">
              <div>
                <span className="text-[#12141a] font-medium block">{h.days}</span>
                <span className="text-[11px] text-[#5e6576]">{h.service}</span>
              </div>
              <div className="text-right">
                <span className="text-[#12141a] font-mono block">{h.times}</span>
                {h.lastSitting !== '-' && (
                  <span className="text-[10px] text-[#8890a0]">Last sitting {h.lastSitting}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concierge & Arrival Guidance */}
      <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-lg space-y-4 text-[#12141a]">
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-[#e2d7ba]">
          <Sparkles className="w-4 h-4 text-[#12141a]" />
          <h4 className="font-serif text-2xl text-[#12141a] font-normal">Concierge & Arrival</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#12141a] font-sans">
          <div className="flex items-center gap-3 p-3 bg-[#fcf5df]/40 rounded-lg border border-[#e2d7ba]">
            <Phone className="w-4 h-4 text-[#12141a] shrink-0" />
            <a href={`tel:${RESTAURANT_INFO.phone.replace(/[^+\d]/g, '')}`} className="group">
              <span className="text-[10px] text-[#5e6576] uppercase tracking-wider block font-sans">Telephone</span>
              <span className="font-mono text-[#12141a] group-hover:underline">{RESTAURANT_INFO.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#fcf5df]/40 rounded-lg border border-[#e2d7ba]">
            <Mail className="w-4 h-4 text-[#12141a] shrink-0" />
            <a href={`mailto:${RESTAURANT_INFO.email}`} className="group">
              <span className="text-[10px] text-[#5e6576] uppercase tracking-wider block font-sans">Reservations</span>
              <span className="text-[#12141a] truncate block group-hover:underline">{RESTAURANT_INFO.email}</span>
            </a>
          </div>
        </div>

        <div className="p-3 bg-[#fcf5df]/50 rounded-lg border border-[#e2d7ba] text-[11px] text-[#5e6576] space-y-1 leading-relaxed font-sans">
          <p className="font-medium text-[#12141a]">Dress Code & Access:</p>
          <p>
            Smart elegant attire is requested. Private discreet valet parking is available on Royal
            Terrace upon advance request with our Maître d’.
          </p>
        </div>
      </div>
    </div>
  )
}
