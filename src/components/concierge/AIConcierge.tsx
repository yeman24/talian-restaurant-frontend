import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { DISHES, TASTING_MENUS } from '@/data/mockData'
import { apiClient } from '@/lib/api-client'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STARTER_PROMPTS = [
  'Recommend something earthy and seasonal',
  'Which options are vegetarian?',
  'Tell me about the wine pairings',
]

function localReply(message: string): string {
  const query = message.toLowerCase()

  if (/allerg|shellfish|mollusc|gluten|dairy|nut/.test(query)) {
    return 'I can highlight ingredients and dietary tags, but allergy safety must be confirmed by our kitchen team for your specific visit. Please add the restriction to your reservation or contact our concierge before booking.'
  }

  if (/reserv|book|table|availability|date|time/.test(query)) {
    return 'I can help you choose the experience, then you can check live dates and sittings in the reservation flow. AURA offers the Autumn Terroir, Forager’s Harvest, and Chef’s Atelier Counter experiences.'
  }

  if (/wine|pairing|sommelier|drink/.test(query)) {
    const dish = DISHES.find((item) => item.winePairing)
    return dish
      ? `Our pairings are created course by course. A lovely example is ${dish.winePairing.name} with ${dish.name}. The reservation flow includes standard, prestige, and botanical pairing options.`
      : 'Our sommelier curates pairings for each seasonal course. The reservation flow includes standard, prestige, and botanical pairing options.'
  }

  if (/hour|open|time|schedule|when/.test(query)) {
    return 'Our opening hours are:\n• Dinner: Wed–Sat 17:30–23:00\n• Lunch: Fri–Sat 12:00–14:30\n• Sunday Supper: 17:00–22:00\n\nReservations open 90 days ahead via our reservation flow.'
  }

  if (/address|location|where|find you|directions|postcode/.test(query)) {
    return 'AURA is located at 14–16 Royal Terrace Vaults, Edinburgh, EH7 5TB, situated within historic 18th-century stone vaults.'
  }

  const dietary = ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'].find((tag) => query.includes(tag))
  const asksForFood = dietary || /recommend|dish|food|eat|starter|course|taste|menu|try|order/.test(query)

  if (asksForFood) {
    const matches = dietary
      ? DISHES.filter((dish) => dish.dietary.some((tag) => tag === dietary)).slice(0, 2)
      : DISHES.filter((dish) => /earthy|mushroom|venison|scallop|sea|fish|meat|vegetable/.test(`${dish.name} ${dish.description}`)).slice(0, 2)

    if (matches.length) {
      return `I would start with ${matches.map((dish) => `${dish.name} (£${dish.price})`).join(' and ')}. Each dish includes provenance and pairing notes on the menu. For the full experience, ${TASTING_MENUS[0].title} offers ${TASTING_MENUS[0].coursesCount} courses.`
    }
  }

  return 'Welcome to AURA. I can recommend dishes, explain Scottish provenance, suggest pairings, answer dining-policy questions, or guide you to reserve a table. What kind of evening are you imagining?'
}

export const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Good evening. I’m AURA’s dining concierge. Tell me what you enjoy, and I’ll guide you through our seasonal menu, pairings, and reservations.',
    },
  ])
  const endOfMessages = useRef<HTMLDivElement>(null)
  const messageSequence = useRef(0)

  const nextMessageId = () => {
    messageSequence.current += 1
    return `message-${messageSequence.current}`
  }

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (value = input) => {
    const trimmed = value.trim()
    if (!trimmed || isTyping) return

    const userMessage: Message = { id: nextMessageId(), role: 'user', content: trimmed }
    const history = messages.slice(-8).map(({ role, content }) => ({ role, content }))
    setMessages((current) => [...current, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const result = await apiClient.post<{ message: string }>('/concierge/chat', {
        message: trimmed,
        history,
      })
      const reply = result?.message || localReply(trimmed)
      setMessages((current) => [
        ...current,
        { id: nextMessageId(), role: 'assistant', content: reply },
      ])
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 350))
      setMessages((current) => [
        ...current,
        { id: nextMessageId(), role: 'assistant', content: localReply(trimmed) },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="no-print">
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-[#d8caa4] bg-[#12141a] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#fcf5df] shadow-2xl shadow-black/30 backdrop-blur-xl transition-all hover:bg-[#202532] cursor-pointer font-sans"
        aria-label={isOpen ? 'Close AI dining concierge' : 'Open AI dining concierge'}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronDown className="h-4 w-4 text-[#fcf5df]" /> : <MessageCircle className="h-4 w-4 text-[#fcf5df]" />}
        <span className="hidden sm:inline">AI Concierge</span>
        <span className="sm:hidden">Concierge</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="false"
            aria-label="AURA AI dining concierge"
            className="fixed bottom-20 right-4 z-40 flex h-[min(650px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#e2d7ba] bg-[#fcf5df] shadow-2xl text-[#12141a]"
          >
            <header className="flex items-start justify-between border-b border-[#e2d7ba] bg-white p-5">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[#12141a]">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] font-sans">Aura Concierge</span>
                </div>
                <p className="text-xs text-[#5e6576] font-sans">Menu guidance, pairings, and reservation help</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-[#5e6576] transition-colors hover:bg-[#fcf5df] hover:text-[#12141a] cursor-pointer" aria-label="Close AI dining concierge">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 font-sans" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-sm bg-[#12141a] text-[#fcf5df]' : 'rounded-bl-sm border border-[#e2d7ba] bg-white text-[#12141a] shadow-xs'}`}>
                    {message.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="space-y-2 pt-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button key={prompt} type="button" onClick={() => sendMessage(prompt)} className="w-full rounded-lg border border-[#e2d7ba] bg-white px-3 py-2 text-left text-xs text-[#12141a] transition-all hover:border-[#12141a] hover:bg-[#fcf5df]/50 cursor-pointer font-sans">
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-[#e2d7ba] bg-white px-4 py-3 text-xs text-[#5e6576] font-sans">Curating a suggestion…</div>
                </div>
              )}
              <div ref={endOfMessages} />
            </div>

            <div className="border-t border-[#e2d7ba] bg-white p-4">
              <div className="mb-3 flex items-center gap-1.5 text-[10px] leading-relaxed text-[#5e6576] font-sans">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#12141a]" />
                Allergy requests must be confirmed by our kitchen team.
              </div>
              <form onSubmit={(event) => { event.preventDefault(); void sendMessage() }} className="flex gap-2">
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about the menu…" aria-label="Ask the AI dining concierge" className="min-w-0 flex-1 rounded-lg border border-[#d8caa4] bg-[#fcf5df]/40 px-3 py-2.5 text-sm text-[#12141a] outline-none transition-colors placeholder:text-[#8890a0] focus:border-[#12141a] font-sans" />
                <button type="submit" disabled={!input.trim() || isTyping} className="rounded-lg bg-[#12141a] px-3 text-[#fcf5df] transition-colors hover:bg-[#202532] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <Link to="/reservations" onClick={() => setIsOpen(false)} className="mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#12141a] transition-colors hover:text-black font-sans">
                <Calendar className="h-3.5 w-3.5" /> Reserve an experience <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
