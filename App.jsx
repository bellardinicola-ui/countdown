{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Mini applicazione pronta all'uso.\
// Puoi pubblicarla direttamente su Vercel, Netlify oppure aprirla localmente.\
\
import React, \{ useState, useEffect \} from "react";\
\
export default function CountdownShareable() \{\
  const [title, setTitle] = useState("Deadline progetto");\
  const [targetInput, setTargetInput] = useState("");\
  const [targetDate, setTargetDate] = useState(null);\
  const [timeLeft, setTimeLeft] = useState(null);\
  const [shareLink, setShareLink] = useState("");\
  const [copySuccess, setCopySuccess] = useState(false);\
\
  // 1. Leggi i parametri dall'URL all'avvio\
  useEffect(() => \{\
    const params = new URLSearchParams(window.location.search);\
    const sharedTitle = params.get("title");\
    const sharedTarget = params.get("target");\
\
    if (sharedTitle) setTitle(sharedTitle);\
\
    if (sharedTarget) \{\
      const parsedDate = new Date(sharedTarget);\
\
      if (!isNaN(parsedDate.getTime())) \{\
        setTargetDate(parsedDate);\
        \
        // Sincronizza anche l'input datetime-local per comodit\'e0 visiva\
        // Rimuove i secondi e il fuso orario per adattarsi al formato dell'input\
        const localISO = parsedDate.toISOString().slice(0, 16);\
        setTargetInput(localISO);\
        \
        // Genera subito il link di condivisione se siamo gi\'e0 su una pagina condivisa\
        setShareLink(window.location.href);\
      \}\
    \}\
  \}, []);\
\
  // 2. Gestisci il ciclo del countdown\
  useEffect(() => \{\
    if (!targetDate) return;\
\
    const updateCountdown = () => \{\
      const now = new Date();\
      const difference = targetDate - now;\
\
      if (difference <= 0) \{\
        setTimeLeft(\{\
          days: 0,\
          hours: 0,\
          minutes: 0,\
          seconds: 0,\
          ended: true,\
        \});\
        return;\
      \}\
\
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));\
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);\
      const m = Math.floor((difference / (1000 * 60)) % 60);\
      const s = Math.floor((difference / 1000) % 60);\
\
      setTimeLeft(\{\
        days: d,\
        hours: h,\
        minutes: m,\
        seconds: s,\
        ended: false,\
      \});\
    \};\
\
    // Esegui subito al cambio di targetDate per evitare il flash di "null"\
    updateCountdown();\
\
    const interval = setInterval(updateCountdown, 1000);\
    return () => clearInterval(interval);\
  \}, [targetDate]);\
\
  const startCountdown = () => \{\
    if (!targetInput) \{\
      alert("Seleziona una data e ora di scadenza");\
      return;\
    \}\
\
    const future = new Date(targetInput);\
\
    if (isNaN(future.getTime())) \{\
      alert("Data non valida");\
      return;\
    \}\
\
    setTargetDate(future);\
\
    const url = new URL(window.location.href);\
    url.searchParams.set("title", title);\
    url.searchParams.set("target", future.toISOString());\
\
    setShareLink(url.toString());\
    setCopySuccess(false);\
\
    // Aggiorna l'URL del browser senza ricaricare la pagina\
    window.history.pushState(\{\}, "", url.toString());\
  \};\
\
  const fallbackCopy = () => \{\
    try \{\
      const textArea = document.createElement("textarea");\
      textArea.value = shareLink;\
      textArea.style.position = "fixed";\
      textArea.style.opacity = "0";\
\
      document.body.appendChild(textArea);\
      textArea.focus();\
      textArea.select();\
\
      const successful = document.execCommand("copy");\
      document.body.removeChild(textArea);\
      return successful;\
    \} catch (err) \{\
      return false;\
    \}\
  \};\
\
  const copyLink = async () => \{\
    if (!shareLink) return;\
\
    try \{\
      if (navigator.clipboard && window.isSecureContext) \{\
        await navigator.clipboard.writeText(shareLink);\
      \} else \{\
        const copied = fallbackCopy();\
        if (!copied) throw new Error("Fallback copy failed");\
      \}\
      setCopySuccess(true);\
    \} catch (error) \{\
      console.error("Errore copia link:", error);\
      alert("Impossibile copiare il link automaticamente. Copialo manualmente dal campo di testo.");\
    \}\
  \};\
\
  return (\
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 flex items-center justify-center">\
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">\
        <h1 className="text-4xl font-bold mb-8 text-center">\
          Countdown condivisibile\
        </h1>\
\
        <div className="space-y-5 mb-8">\
          <div>\
            <label className="block mb-2 text-sm uppercase tracking-wide text-slate-300">\
              Titolo del countdown\
            </label>\
            <input\
              type="text"\
              value=\{title\}\
              onChange=\{(e) => setTitle(e.target.value)\}\
              className="w-full rounded-2xl px-4 py-3 bg-slate-900/60 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"\
              placeholder="Es. Lancio nuova release"\
            />\
          </div>\
\
          <div>\
            <label className="block mb-2 text-sm uppercase tracking-wide text-slate-300">\
              Data e ora di scadenza\
            </label>\
            <input\
              type="datetime-local"\
              value=\{targetInput\}\
              onChange=\{(e) => setTargetInput(e.target.value)\}\
              className="w-full rounded-2xl px-4 py-3 bg-slate-900/60 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"\
            />\
          </div>\
\
          <button\
            onClick=\{startCountdown\}\
            className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition text-lg font-semibold shadow-lg"\
          >\
            Crea countdown\
          </button>\
        </div>\
\
        \{/* Mostra questa sezione se c'\'e8 un countdown attivo */\}\
        \{timeLeft && (\
          <div className="text-center mt-8 pt-8 border-t border-white/10">\
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">\{title\}</h2>\
\
            \{timeLeft.ended ? (\
              <div className="relative overflow-hidden rounded-3xl h-[420px] border border-white/10 bg-gradient-to-b from-slate-950 via-indigo-950 to-orange-300 flex flex-col items-center justify-center">\
                <div className="absolute inset-0 overflow-hidden">\
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-orange-200/60 to-transparent" />\
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-yellow-300 blur-3xl opacity-70 animate-pulse" />\
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-yellow-200 shadow-[0_0_120px_rgba(255,220,120,0.9)]" />\
                </div>\
\
                <div className="relative z-10 text-center px-6">\
                  <div className="text-6xl mb-6 animate-bounce">\uc0\u9728 \u65039 </div>\
                  <h3 className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-2xl mb-6">\
                    A NEW CHAPTER<br />BEGINS\
                  </h3>\
                  <p className="text-3xl md:text-4xl italic font-semibold text-yellow-100 drop-shadow-xl mt-2 animate-pulse">\
                    ...speremo \uc0\u10024 \
                  </p>\
                  <div className="mt-10 flex justify-center gap-3 flex-wrap">\
                    \{["Resilience", "Restart", "Future", "Together"].map((word) => (\
                      <div\
                        key=\{word\}\
                        className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm uppercase tracking-widest"\
                      >\
                        \{word\}\
                      </div>\
                    ))\}\
                  </div>\
                </div>\
              </div>\
            ) : (\
              <div className="grid grid-cols-4 gap-4 mb-8">\
                \{[\
                  \{ label: "Giorni", value: timeLeft.days \},\
                  \{ label: "Ore", value: timeLeft.hours \},\
                  \{ label: "Min", value: timeLeft.minutes \},\
                  \{ label: "Sec", value: timeLeft.seconds \},\
                ].map((item) => (\
                  <div\
                    key=\{item.label\}\
                    className="bg-slate-900/50 rounded-2xl p-5 border border-slate-700"\
                  >\
                    <div className="text-2xl md:text-4xl font-extrabold">\{item.value\}</div>\
                    <div className="text-xs md:text-sm text-slate-300 mt-2 uppercase tracking-wide">\
                      \{item.label\}\
                    </div>\
                  </div>\
                ))\}\
              </div>\
            )\}\
\
            \{shareLink && (\
              <div className="space-y-3 mt-6">\
                <input\
                  type="text"\
                  readOnly\
                  value=\{shareLink\}\
                  className="w-full rounded-2xl px-4 py-3 text-sm bg-slate-900/60 border border-slate-600 text-center text-slate-300"\
                />\
\
                <button\
                  onClick=\{copyLink\}\
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 transition font-semibold shadow-md"\
                >\
                  Copia link da condividere\
                </button>\
\
                \{copySuccess && (\
                  <div className="text-emerald-400 text-sm font-medium animate-fade-in">\
                    Link copiato con successo \uc0\u9989 \
                  </div>\
                )\}\
              </div>\
            )\}\
          </div>\
        )\}\
      </div>\
    </div>\
  );\
\}}