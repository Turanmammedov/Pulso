import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import { supabase } from './supabase'
import I18N, { LANGS, LOCALES, CURS } from './i18n'

const Ctx = createContext()
const useApp = () => useContext(Ctx)

function loadSettings() {
  try { return { lang: 'tr', theme: 'system', cur: 'TRY', ...JSON.parse(localStorage.getItem('butce_settings') || '{}') } }
  catch { return { lang: 'tr', theme: 'system', cur: 'TRY' } }
}

function Seg({ opts, val, on }) {
  return <div className="seg">{opts.map(([k, l]) => <button key={k} className={val === k ? 'on' : ''} onClick={() => on(k)}>{l}</button>)}</div>
}

function Modal({ onClose, children }) {
  const [out, setOut] = useState(false)
  const close = () => { setOut(true); setTimeout(onClose, 200) }
  return (
    <div className={'ov' + (out ? ' out' : '')} onClick={close}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>{children(close)}</div>
    </div>
  )
}

function FormSheet({ cfg, onClose }) {
  const { t } = useApp()
  const [v, setV] = useState(cfg.init || {})
  return (
    <Modal onClose={onClose}>{(close) => <>
      <h3>{cfg.title}</h3>
      {cfg.fields.map(([k, ph, num]) => (
        <input key={k} placeholder={ph} type={num ? 'number' : 'text'} step={num ? 'any' : undefined} inputMode={num ? 'decimal' : 'text'} value={v[k] ?? ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
      ))}
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn g" onClick={close}>{t.cancel}</button>
        <button className="btn" onClick={() => { if (v[cfg.fields[0][0]]) { cfg.onSave(v); close() } }}>{t.save}</button>
      </div>
    </>}</Modal>
  )
}

// Hızlı buton onay penceresi: adet ve fiyat düzenlenebilir
function ConfirmSheet({ q, onOk, onClose }) {
  const { t, fm } = useApp()
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(String(q.price))
  const total = Math.round((+qty || 0) * (+String(price).replace(',', '.') || 0) * 100) / 100
  return (
    <Modal onClose={onClose}>{(close) => <>
      <div style={{ textAlign: 'center', fontSize: 44 }}>{q.icon}</div>
      <h3 style={{ textAlign: 'center', fontSize: 17, color: 'var(--tx)' }}>{q.name}</h3>
      <div className="mu">{t.qty}</div>
      <div className="stepper">
        <button onClick={() => setQty(Math.max(1, (+qty || 1) - 1))}>−</button>
        <input type="number" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
        <button onClick={() => setQty((+qty || 0) + 1)}>+</button>
      </div>
      <div className="mu" style={{ marginTop: 10 }}>{t.unit}</div>
      <input type="number" step="any" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="tot">{t.totalL}: {fm(total)}</div>
      <div className="row">
        <button className="btn g" onClick={close}>{t.cancel}</button>
        <button className="btn" onClick={() => { if (total > 0) { onOk(total); close() } }}>{t.confirm}</button>
      </div>
    </>}</Modal>
  )
}

function Auth() {
  const { t, set, S } = useApp()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)
  const up = mode === 'signup'
  const switchTo = (m) => { setMode(m); setPw(''); setPw2('') }
  const submit = async (e) => {
    e.preventDefault()
    if (up) {
      if (pw.length < 6) return alert(t.pwShort)
      if (pw !== pw2) return alert(t.pwMis)
    }
    setBusy(true)
    const c = { email: email.trim(), password: pw }
    const { data, error } = up ? await supabase.auth.signUp(c) : await supabase.auth.signInWithPassword(c)
    setBusy(false)
    if (error) return alert(error.message)
    if (up && !data.session) { alert(t.signupOk); switchTo('login') }
  }
  return (
    <div className="page" style={{ marginTop: 50 }} key={mode}>
      <h1>💰 Bütçem</h1>
      <p className="mu" style={{ margin: '-8px 4px 16px' }}>{t.tagline}</p>
      <form className="glass card" onSubmit={submit}>
        <h3 style={{ color: 'var(--tx)', fontSize: 18 }}>{up ? t.createT : t.welcome}</h3>
        <input placeholder={t.email} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder={t.pw} type="password" autoComplete={up ? 'new-password' : 'current-password'} required value={pw} onChange={(e) => setPw(e.target.value)} />
        {up && <input placeholder={t.pw2} type="password" autoComplete="new-password" required value={pw2} onChange={(e) => setPw2(e.target.value)} />}
        <div style={{ height: 8 }} />
        <button className="btn" type="submit" disabled={busy}>{busy ? t.busy : up ? t.signup : t.login}</button>
      </form>
      <p className="mu" style={{ textAlign: 'center' }}>
        {up ? t.haveAcc : t.noAcc}{' '}
        <button type="button" className="lnk" onClick={() => switchTo(up ? 'login' : 'signup')}>{up ? t.login : t.signup}</button>
      </p>
      <Seg opts={Object.entries(LANGS)} val={S.lang} on={(k) => set({ lang: k })} />
    </div>
  )
}

const ICONS = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" /></>,
  receipt: <><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  bank: <><path d="M3 10 12 4l9 6" /><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" /><path d="M3 21h18" /></>,
  chart: <path d="M5 21V11M12 21V4M19 21v-7" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>,
}
const Icon = ({ n }) => <svg viewBox="0 0 24 24">{ICONS[n]}</svg>
const TABS = [['home', 'home', 'home'], ['exp', 'receipt', 'exp'], ['loan', 'bank', 'loan'], ['sum', 'chart', 'sum'], ['pro', 'user', 'prof']]

function Main({ session }) {
  const { t, fm, locale, S, set } = useApp()
  const [tab, setTab] = useState('home')
  const [profile, setProfile] = useState({ name: '', monthly_budget: 0 })
  const [quick, setQuick] = useState([])
  const [exp, setExp] = useState([])
  const [loans, setLoans] = useState([])
  const [sheet, setSheet] = useState(null)
  const [conf, setConf] = useState(null)
  const [off, setOff] = useState(0)

  const load = useCallback(async () => {
    const [p, q, e, l] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      supabase.from('quick_items').select('*').order('name'),
      supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(1000),
      supabase.from('loans').select('*').order('pay_day'),
    ])
    if (p.data) setProfile(p.data)
    setQuick(q.data || []); setExp(e.data || []); setLoans(l.data || [])
  }, [session])
  useEffect(() => { load() }, [load])

  const run = async (q) => { const { error } = await q; if (error) alert(error.message); load() }
  const addExp = (name, price, icon) => run(supabase.from('expenses').insert({ name, price: +price, icon }))

  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + off)
  const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  const mExp = exp.filter((x) => x.created_at.slice(0, 7) === mKey)
  const spent = mExp.reduce((a, x) => a + +x.price, 0)
  const left = profile.monthly_budget - spent
  const by = {}; mExp.forEach((x) => { by[x.name] = (by[x.name] || 0) + +x.price })
  const top = Object.entries(by).sort((a, b) => b[1] - a[1])
  const col = left < 0 ? 'var(--bad)' : 'var(--ok)'
  const pc = Math.min(100, (spent / (profile.monthly_budget || 1)) * 100)
  const uname = profile.name && profile.name !== 'Kullanıcı' ? profile.name : t.defName
  const idx = TABS.findIndex((x) => x[0] === tab)

  return (
    <>
      <div className="page" key={tab}>
        {tab === 'home' && <>
          <h1>{t.hello}, {uname} ☺︎</h1> 
          <div className="glass card">
            <div className="mu">{t.left}</div>
            <div className="big" style={{ color: col }}>{fm(left)}</div>
            <div className="bar"><i style={{ width: pc + '%' }} /></div>
            <div className="row mu"><span>{t.spent} {fm(spent)}</span><span>{t.budget} {fm(profile.monthly_budget)}</span></div>
          </div>
          <div className="row"><h3 style={{ margin: 0 }}>{t.quick}</h3>
            <button className="btn s" onClick={() => setSheet({ title: t.newBtn, fields: [['name', t.name], ['price', t.price, 1], ['icon', t.emoji]],
              onSave: (v) => run(supabase.from('quick_items').insert({ name: v.name, price: +v.price || 0, icon: v.icon || '🛒' })) })}>{t.new}</button></div>
          <div className="grid">
            {quick.map((q, i) => (
              <button key={q.id} className="q" style={{ animationDelay: i * 0.04 + 's' }} onClick={() => setConf(q)}
                onContextMenu={(e) => { e.preventDefault(); if (confirm(`${q.name} ${t.delQ}`)) run(supabase.from('quick_items').delete().eq('id', q.id)) }}>
                <span>{q.icon}</span><b>{q.name}</b><div className="mu">{fm(q.price)}</div>
              </button>))}
          </div>
          <p className="mu" style={{ textAlign: 'center' }}>{t.hint}</p>
        </>}

        {tab === 'exp' && <>
          <h1>{t.expT}</h1>
          <div className="glass card">
            {!mExp.length && <div className="mu">{t.noExp}</div>}
            {mExp.map((x) => (
              <div key={x.id} className="row li">
                <span>{x.icon} {x.name}<div className="mu">{new Date(x.created_at).toLocaleDateString(locale)}</div></span>
                <b style={{ cursor: 'pointer' }} onClick={() => run(supabase.from('expenses').delete().eq('id', x.id))}>{fm(x.price)} ✕</b>
              </div>))}
          </div>
          <button className="btn" onClick={() => setSheet({ title: t.manual, fields: [['name', t.name], ['price', t.amount, 1]], onSave: (v) => addExp(v.name, v.price || 0, '💸') })}>{t.addExp}</button>
        </>}

        {tab === 'loan' && <>
          <h1>{t.loansT}</h1>
          {loans.map((l) => {
            const rem = l.total_installments - l.paid_installments
            return (
              <div key={l.id} className="glass card">
                <div className="row"><b>{l.name}</b><span className="mu">{t.day.replace('{d}', l.pay_day)}</span></div>
                <div className="row"><span>{t.monthly} <b>{fm(l.monthly_amount)}</b></span><span>{t.debt} <b>{fm(rem * l.monthly_amount)}</b></span></div>
                <div className="bar"><i style={{ width: (l.paid_installments / l.total_installments) * 100 + '%' }} /></div>
                <div className="row"><span className="mu">{t.paidOf.replace('{a}', l.paid_installments).replace('{b}', l.total_installments)}</span>
                  {rem > 0 ? <button className="btn s" onClick={() => run(supabase.rpc('pay_loan', { p_loan_id: l.id }))}>{t.pay}</button> : <span>{t.done}</span>}</div>
              </div>)
          })}
          {!loans.length && <p className="mu">{t.noLoan}</p>}
          <button className="btn" onClick={() => setSheet({ title: t.newLoan, fields: [['name', t.loanName], ['m', t.inst, 1], ['c', t.total, 1], ['d', t.payDay, 1]],
            onSave: (v) => run(supabase.from('loans').insert({ name: v.name, monthly_amount: +v.m || 0, total_installments: +v.c || 1, pay_day: +v.d || 1 })) })}>{t.addLoan}</button>
        </>}

        {tab === 'sum' && <>
          <h1>{t.sumT}</h1>
          <div className="glass card">
            <div className="row"><button className="btn g s" onClick={() => setOff(off - 1)}>‹</button><b style={{ textTransform: 'capitalize' }}>{d.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</b><button className="btn g s" onClick={() => setOff(off + 1)}>›</button></div>
            <div className="row"><span>{t.budget}</span><b>{fm(profile.monthly_budget)}</b></div>
            <div className="row"><span>{t.spent}</span><b>{fm(spent)}</b></div>
            <div className="row"><span>{t.left}</span><b style={{ color: col }}>{fm(left)}</b></div>
            <div className="row"><span>{t.top}</span><b>{top[0] ? `${top[0][0]} (${fm(top[0][1])})` : '-'}</b></div>
          </div>
          <div className="glass card"><h3>{t.byCat}</h3>
            {top.map(([k, v]) => (
              <div key={k}><div className="row"><span>{k}</span><span>{fm(v)}</span></div><div className="bar"><i style={{ width: (v / top[0][1]) * 100 + '%' }} /></div></div>))}
            {!top.length && <div className="mu">{t.noData}</div>}
          </div>
        </>}

        {tab === 'pro' && <>
          <h1>{t.profT}</h1>
          <div className="glass card">
            <div className="row"><span>{t.name}</span><b>{uname}</b></div>
            <div className="row"><span>{t.email}</span><b>{session.user.email}</b></div>
            <div className="row"><span>{t.mBudget}</span><b>{fm(profile.monthly_budget)}</b></div>
            <div style={{ height: 8 }} />
            <button className="btn g" onClick={() => setSheet({ title: t.profT, fields: [['name', t.name], ['b', t.mBudget, 1]], init: { name: uname, b: profile.monthly_budget },
              onSave: (v) => run(supabase.from('profiles').update({ name: v.name || profile.name, monthly_budget: +v.b || profile.monthly_budget }).eq('id', session.user.id)) })}>{t.edit}</button>
          </div>
          <div className="glass card">
            <h3>⚙️ {t.settings}</h3>
            <div className="mu">{t.lang}</div>
            <Seg opts={Object.entries(LANGS)} val={S.lang} on={(k) => set({ lang: k })} />
            <div className="mu">{t.theme}</div>
            <Seg opts={[['system', '⏣ ' + t.system], ['light', '☯ ' + t.light], ['dark', '⏾ ' + t.dark]]} val={S.theme} on={(k) => set({ theme: k })} />
            <div className="mu">{t.cur}</div>
            <Seg opts={Object.entries(CURS).map(([k, s]) => [k, `${s} ${k}`])} val={S.cur} on={(k) => set({ cur: k })} />
            <div className="mu">{t.curNote}</div>
          </div>
          <button className="btn g" onClick={() => supabase.auth.signOut()}>{t.logout}</button>
        </>}
      </div>

      <nav className="tabs glass">
        <div className="pill" style={{ transform: `translateX(${idx * 100}%)` }} />
        {TABS.map(([k, ic, lb]) => (
          <button key={k} className={'tab' + (tab === k ? ' on' : '')} onClick={() => setTab(k)}><span><Icon n={ic} /></span>{t[lb]}</button>))}
      </nav>
      {sheet && <FormSheet cfg={sheet} onClose={() => setSheet(null)} />}
      {conf && <ConfirmSheet q={conf} onClose={() => setConf(null)} onOk={(total) => addExp(conf.name, total, conf.icon)} />}
    </>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined)
  const [S, setS] = useState(loadSettings)
  const set = (p) => setS((o) => { const n = { ...o, ...p }; try { localStorage.setItem('butce_settings', JSON.stringify(n)) } catch {} return n })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const th = S.theme === 'system' ? (mq.matches ? 'dark' : 'light') : S.theme
      const el = document.documentElement
      el.dataset.theme = th
      el.style.colorScheme = th
      let cs = document.querySelector('meta[name="color-scheme"]')
      if (!cs) { cs = document.createElement('meta'); cs.name = 'color-scheme'; document.head.appendChild(cs) }
      cs.content = S.theme === 'system' ? 'light dark' : th
      const bg = th === 'dark' ? '#0b0d17' : '#f4f5f9'
      el.style.backgroundColor = bg
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
      const m = document.createElement('meta'); m.name = 'theme-color'; m.content = bg; document.head.appendChild(m)
      try { localStorage.setItem('butce_theme_bg', th) } catch {}
    }
    apply(); mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [S.theme])
  useEffect(() => { document.documentElement.lang = S.lang }, [S.lang])
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const locale = LOCALES[S.lang]
  const fm = (n) => `${(Math.round((+n || 0) * 100) / 100).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${CURS[S.cur]}`
  if (session === undefined) return null
  return (
    <Ctx.Provider value={{ t: I18N[S.lang], fm, locale, S, set }}>
      {session ? <Main session={session} /> : <Auth />}
    </Ctx.Provider>
  )
}
