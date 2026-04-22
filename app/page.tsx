'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'

    const isDark = document.documentElement.classList.contains('dark')
    const sun = document.getElementById('icon-sun')
    const moon = document.getElementById('icon-moon')
    if (sun) sun.style.display = isDark ? 'block' : 'none'
    if (moon) moon.style.display = isDark ? 'none' : 'block'

    const nav = document.getElementById('lp-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })

    const ro = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el))

    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const el = e.target as HTMLElement
        if (!e.isIntersecting || el.dataset.done) return
        el.dataset.done = '1'
        const target = parseFloat(el.dataset.target!)
        const suffix = el.dataset.suffix || ''
        const decimal = parseInt(el.dataset.decimal || '0')
        const dur = 1600, start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          const val = ease * target
          el.textContent = (decimal ? val.toFixed(decimal) : Math.round(val).toLocaleString()) + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('.counter').forEach(c => co.observe(c))

    const onMouse = (ev: MouseEvent) => {
      const mesh = document.querySelector('.hero-mesh') as HTMLElement | null
      if (!mesh) return
      mesh.style.transform = `translate(${(ev.clientX / innerWidth - .5) * 18}px,${(ev.clientY / innerHeight - .5) * 18}px)`
    }
    document.addEventListener('mousemove', onMouse)

    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mousemove', onMouse)
      ro.disconnect()
      co.disconnect()
    }
  }, [])

  function toggleTheme() {
    const html = document.documentElement
    const isDark = !html.classList.contains('dark')
    html.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    const sun = document.getElementById('icon-sun')
    const moon = document.getElementById('icon-moon')
    if (sun) sun.style.display = isDark ? 'block' : 'none'
    if (moon) moon.style.display = isDark ? 'none' : 'block'
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --primary:#07111E;--secondary:#81B9E9;--sand:#E1C1A6;--gold:#DBCF63;--mist:#A2B2CD;
          --s50:#EFF8FF;--s100:#DBEEFB;--s200:#BDE0F7;--s300:#93CBF2;--s400:#81B9E9;--s500:#5BA0D8;
          --s600:#3B83BE;--s700:#2A6499;--s800:#1D4872;--s900:#122E4D;--s950:#0B1E35;
          --p50:#F0F4F8;--p100:#DCE6F0;--p200:#B9CEE1;--p600:#254F6A;--p700:#163749;--p800:#0E2535;--p900:#07111E;--p950:#030C16;
          --sand100:#FAF0E6;--sand200:#F3DECB;--sand400:#E1C1A6;--sand500:#D4A882;
          --mist100:#E8ECF3;--mist200:#D0D9E8;--mist400:#A2B2CD;--mist500:#8298BA;
          --gold100:#FDF8C3;--gold300:#F0E464;--gold400:#DBCF63;
          --bg:#FFFFFF;--bg-card:#FFFFFF;--bg-muted:#F9FAFB;--fg:#07111E;--fg-muted:#6B7280;--fg-subtle:#9CA3AF;
          --border:#F3F4F6;--border-md:#E5E7EB;--ring:rgba(129,185,233,.5);
          --r-sm:4.8px;--r-md:6.4px;--r-lg:8px;--r-xl:11.2px;--r-2xl:17.6px;--r-3xl:22px;--r-full:9999px;
          --card-ring:0 0 0 1px rgba(7,16,29,.06);--card-inset:inset 0 0 1px 0 rgba(7,16,29,.32);--btn-inset:inset 0 -1px .5px rgba(6,15,27,.15);
        }
        .dark {
          --bg:#07111E;--bg-card:#0D1B2E;--bg-muted:#1A3050;--fg:#F0F6FF;--fg-muted:#7FA8CC;--fg-subtle:#4A7BA3;
          --border:rgba(129,185,233,.12);--border-md:rgba(129,185,233,.18);--card-ring:0 0 0 1px rgba(129,185,233,.12);
        }
        html { scroll-behavior: smooth; }
        body { font-family:'Manrope',sans-serif; background:var(--bg); color:var(--fg); overflow-x:hidden; overflow-y:auto!important; height:auto!important; -webkit-font-smoothing:antialiased; transition:background .25s,color .25s; }
        nav { position:fixed;inset:0 0 auto 0;height:64px;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 40px;transition:background .3s,border-color .3s,box-shadow .3s; }
        nav.scrolled { background:var(--bg);border-bottom:1px solid var(--border);box-shadow:0 1px 4px rgba(7,17,30,.04); }
        .nav-logo { display:flex;align-items:center;gap:7px;font-size:16px;font-weight:800;color:var(--fg);text-decoration:none;letter-spacing:-.3px; }
        .nav-logo-mark { width:28px;height:28px;background:linear-gradient(135deg,var(--s600),var(--s400));border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;font-weight:800; }
        .nav-links { display:flex;align-items:center;gap:2px;list-style:none; }
        .nav-links a { font-size:13.5px;font-weight:500;color:var(--fg-muted);text-decoration:none;padding:6px 12px;border-radius:var(--r-lg);transition:color .15s,background .15s; }
        .nav-links a:hover { color:var(--fg);background:var(--bg-muted); }
        .nav-right { display:flex;align-items:center;gap:8px; }
        .nav-icon-btn { width:34px;height:34px;border:none;background:none;cursor:pointer;color:var(--fg-muted);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;transition:color .15s,background .15s; }
        .nav-icon-btn:hover { color:var(--fg);background:var(--bg-muted); }
        .nav-icon-btn svg { width:16px;height:16px; }
        .btn-nav { height:34px;padding:0 16px;background:var(--primary);color:#fff;border:none;cursor:pointer;border-radius:var(--r-lg);font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:5px;box-shadow:var(--btn-inset);transition:opacity .15s,transform .2s; }
        .btn-nav:hover { opacity:.85; }
        .dark .btn-nav { background:var(--secondary);color:var(--primary); }
        #hero { min-height:100vh;padding:96px 40px 80px;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;position:relative;overflow:hidden; }
        .hero-mesh { position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 55% 55% at 68% 38%,rgba(129,185,233,.13) 0%,transparent 70%),radial-gradient(ellipse 35% 35% at 82% 72%,rgba(162,178,205,.1) 0%,transparent 60%),radial-gradient(ellipse 28% 28% at 18% 82%,rgba(219,207,99,.06) 0%,transparent 60%); }
        .dark .hero-mesh { background:radial-gradient(ellipse 55% 55% at 68% 38%,rgba(129,185,233,.07) 0%,transparent 70%),radial-gradient(ellipse 35% 35% at 82% 72%,rgba(26,48,80,.6) 0%,transparent 60%); }
        .hero-left { position:relative;z-index:1; }
        .eyebrow { display:inline-flex;align-items:center;gap:7px;background:rgba(129,185,233,.1);border:1px solid rgba(129,185,233,.25);color:var(--s700);font-size:11.5px;font-weight:700;padding:5px 12px;border-radius:var(--r-full);letter-spacing:.05em;text-transform:uppercase;margin-bottom:24px; }
        .dark .eyebrow { color:var(--secondary);border-color:rgba(129,185,233,.2); }
        .eyebrow-dot { width:6px;height:6px;border-radius:50%;background:var(--secondary);animation:blink 2s ease infinite; }
        @keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
        .hero-h1 { font-size:clamp(44px,5vw,72px);font-weight:800;line-height:1.05;letter-spacing:-2px;margin-bottom:20px; }
        .hero-h1 .line { display:block;overflow:hidden; }
        .hero-h1 .word { display:inline-block;transform:translateY(108%);animation:word-up .75s cubic-bezier(.16,1,.3,1) forwards; }
        .w1{animation-delay:.05s}.w2{animation-delay:.14s}.w3{animation-delay:.23s}.w4{animation-delay:.32s}
        .grad-text { background:linear-gradient(135deg,var(--s600) 0%,var(--s400) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .dark .grad-text { background:linear-gradient(135deg,var(--s300) 0%,var(--s400) 100%);-webkit-background-clip:text;background-clip:text; }
        @keyframes word-up{to{transform:translateY(0)}}
        .hero-desc { font-size:16px;font-weight:400;line-height:1.72;color:var(--fg-muted);max-width:420px;margin-bottom:36px;opacity:0;animation:fade-up .8s ease .5s forwards; }
        .hero-actions { display:flex;gap:10px;align-items:center;opacity:0;animation:fade-up .8s ease .62s forwards; }
        .btn-primary { height:40px;padding:0 22px;background:var(--primary);color:#fff;border:none;cursor:pointer;border-radius:var(--r-lg);font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:var(--btn-inset);transition:opacity .15s,transform .2s,box-shadow .2s;white-space:nowrap; }
        .btn-primary:hover { opacity:.85;transform:translateY(-1px); }
        .dark .btn-primary { background:var(--secondary);color:var(--primary); }
        .btn-ghost { height:40px;padding:0 18px;background:transparent;color:var(--fg-muted);border:1px solid var(--border-md);cursor:pointer;border-radius:var(--r-lg);font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:color .15s,background .15s; }
        .btn-ghost:hover { color:var(--fg);background:var(--bg-muted); }
        .hero-proof { display:flex;align-items:center;gap:12px;margin-top:36px;opacity:0;animation:fade-up .8s ease .76s forwards; }
        .proof-avatars { display:flex; }
        .proof-av { width:26px;height:26px;border-radius:50%;border:2px solid var(--bg);margin-left:-7px; }
        .proof-av:first-child { margin-left:0; }
        .pa1{background:linear-gradient(135deg,var(--s200),var(--s500))}.pa2{background:linear-gradient(135deg,var(--sand100),var(--sand500))}.pa3{background:linear-gradient(135deg,var(--mist100),var(--mist500))}.pa4{background:linear-gradient(135deg,var(--gold100),var(--gold400))}
        .proof-text { font-size:12.5px;color:var(--fg-muted);line-height:1.4; }
        .proof-text strong { color:var(--fg);font-weight:700; }
        .hero-right { position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:176px 176px 116px;gap:8px;opacity:0;animation:fade-up 1s ease .3s forwards; }
        .htile { border-radius:14px;overflow:hidden;position:relative;transition:transform .5s cubic-bezier(.16,1,.3,1); }
        .htile:hover { transform:scale(1.02); }
        .htile:nth-child(1){grid-column:1;grid-row:1}.htile:nth-child(2){grid-column:2;grid-row:1/3;border-radius:18px}.htile:nth-child(3){grid-column:3;grid-row:1}.htile:nth-child(4){grid-column:1;grid-row:2/4;border-radius:18px}.htile:nth-child(5){grid-column:3;grid-row:2}.htile:nth-child(6){grid-column:2/4;grid-row:3}
        .t1{background:linear-gradient(145deg,var(--s200),var(--s400))}.t2{background:linear-gradient(145deg,var(--p700),var(--p900))}.t3{background:linear-gradient(145deg,var(--sand200),var(--sand400))}.t4{background:linear-gradient(145deg,var(--mist200),var(--mist400))}.t5{background:linear-gradient(145deg,var(--gold100),var(--gold400))}.t6{background:linear-gradient(145deg,var(--s100),var(--s300))}
        .tile-grad { position:absolute;inset:0;background:linear-gradient(to top,rgba(7,17,30,.2),transparent); }
        .tile-label { position:absolute;bottom:10px;left:10px;background:rgba(255,255,255,.88);backdrop-filter:blur(8px);font-size:9.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--primary);padding:3px 8px;border-radius:var(--r-full); }
        .hero-float { position:absolute;background:var(--bg-card);border:1px solid var(--border-md);border-radius:14px;padding:10px 14px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 28px rgba(7,17,30,.1);z-index:2;white-space:nowrap; }
        .hf-top{top:-14px;right:16px;animation:float 3s ease-in-out infinite}.hf-bot{bottom:8px;left:-18px;animation:float 3s ease-in-out 1.5s infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .hf-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px}
        .hf-blue{background:rgba(129,185,233,.15)}.hf-sand{background:rgba(225,193,166,.2)}
        .hf-title{font-size:12.5px;font-weight:700;color:var(--fg)}.hf-sub{font-size:11px;color:var(--fg-muted);margin-top:1px}
        @keyframes fade-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .marquee-strip { background:var(--primary);padding:14px 0;overflow:hidden;white-space:nowrap; }
        .marquee-track { display:inline-flex;animation:marquee 30s linear infinite; }
        .marquee-item { display:inline-flex;align-items:center;gap:14px;font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(240,246,255,.4);padding:0 28px; }
        .marquee-item.hi{color:var(--secondary)}.marquee-sep{width:3px;height:3px;background:var(--s600);border-radius:50%}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .sec-label { font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--s600);margin-bottom:8px; }
        .dark .sec-label { color:var(--secondary); }
        .sec-title { font-size:clamp(26px,3vw,40px);font-weight:800;letter-spacing:-1px;line-height:1.1;margin-bottom:10px; }
        .sec-header { margin-bottom:36px; }
        .sec-header-row { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:36px; }
        .btn-outline { height:36px;padding:0 18px;border:1px solid var(--border-md);border-radius:var(--r-lg);background:transparent;font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;color:var(--fg-muted);text-decoration:none;display:inline-flex;align-items:center;gap:5px;transition:color .15s,background .15s;white-space:nowrap; }
        .btn-outline:hover { color:var(--fg);background:var(--bg-muted); }
        #categories { padding:72px 40px;background:var(--bg-muted);border-top:1px solid var(--border);border-bottom:1px solid var(--border); }
        .cat-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:10px; }
        .cat-card { background:var(--bg-card);border-radius:var(--r-2xl);padding:22px 18px;display:flex;flex-direction:column;gap:14px;cursor:pointer;position:relative;overflow:hidden;box-shadow:var(--card-ring),var(--card-inset);transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s; }
        .cat-card:hover { transform:translateY(-5px);box-shadow:0 16px 40px rgba(7,17,30,.09),var(--card-inset); }
        .dark .cat-card:hover { box-shadow:0 16px 40px rgba(0,0,0,.35),var(--card-inset); }
        .cat-topbar { position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(to right,var(--s600),var(--s400));opacity:0;transition:opacity .25s; }
        .cat-card:hover .cat-topbar { opacity:1; }
        .cat-icon { width:38px;height:38px;border-radius:var(--r-xl);background:rgba(129,185,233,.12);display:flex;align-items:center;justify-content:center;font-size:17px;transition:background .25s; }
        .cat-card:hover .cat-icon { background:rgba(129,185,233,.22); }
        .cat-name{font-size:13px;font-weight:700;line-height:1.35}.cat-count{font-size:11.5px;color:var(--fg-muted);font-weight:500;margin-top:2px}
        .wwh-row { padding:100px 40px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;border-bottom:1px solid var(--border); }
        .wwh-row:last-child { border-bottom:none; }
        .wwh-flip .wwh-text{order:2}.wwh-flip .wwh-visual{order:1}
        .wwh-text { display:flex;flex-direction:column;gap:16px; }
        .wwh-title { font-size:clamp(32px,3.5vw,52px);font-weight:800;letter-spacing:-1.5px;line-height:1.08; }
        .wwh-desc { font-size:16px;line-height:1.72;color:var(--fg-muted);max-width:440px; }
        .wwh-list { list-style:none;display:flex;flex-direction:column;gap:13px;margin-top:4px; }
        .wwh-list li { font-size:14.5px;font-weight:500;color:var(--fg);display:flex;align-items:flex-start;gap:10px;line-height:1.5; }
        .wwh-visual { display:flex;align-items:center;justify-content:center;position:relative; }
        .browser { width:100%;max-width:460px;background:var(--bg-card);border-radius:18px;overflow:hidden;box-shadow:0 32px 80px rgba(7,17,30,.14),var(--card-ring),var(--card-inset); }
        .browser-bar { background:var(--bg-muted);height:42px;display:flex;align-items:center;padding:0 16px;gap:6px;border-bottom:1px solid var(--border); }
        .bwdot{width:10px;height:10px;border-radius:50%}.bwd1{background:#FF5F57}.bwd2{background:#FEBC2E}.bwd3{background:#28C840}
        .browser-url { flex:1;background:var(--bg);border-radius:7px;height:24px;margin:0 12px;display:flex;align-items:center;padding:0 10px;font-size:10.5px;color:var(--fg-subtle);border:1px solid var(--border); }
        .browser-body { padding:18px;display:flex;flex-direction:column;gap:10px; }
        .bb-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}
        .bb-title{font-size:13px;font-weight:700}
        .bb-badge { font-size:10px;font-weight:700;letter-spacing:.04em;background:rgba(129,185,233,.12);color:var(--s700);padding:3px 9px;border-radius:100px; }
        .dark .bb-badge{color:var(--secondary)}
        .bb-card { background:var(--bg-muted);border-radius:13px;padding:12px;display:flex;align-items:center;gap:10px;border:1px solid var(--border); }
        .bb-av{width:36px;height:36px;border-radius:50%;flex-shrink:0}.bb-info{flex:1}
        .bb-name{font-size:12.5px;font-weight:700;margin-bottom:1px}.bb-role{font-size:11px;color:var(--fg-muted)}.bb-stars{font-size:9.5px;color:var(--gold400);letter-spacing:1px}
        .bb-cta { height:28px;padding:0 12px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-family:'Manrope',sans-serif;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap; }
        .dark .bb-cta{background:var(--secondary);color:var(--primary)}
        .why-vis-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:440px}
        .why-vis-card { background:var(--bg-card);border-radius:20px;padding:26px 22px;box-shadow:var(--card-ring),var(--card-inset);display:flex;flex-direction:column;gap:8px; }
        .why-vis-icon{font-size:22px}.why-vis-val{font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1}.why-vis-sub{font-size:12px;color:var(--fg-muted);font-weight:500}
        .steps{display:flex;flex-direction:column}
        .step { padding:22px 20px;border-radius:var(--r-2xl);position:relative;transition:background .2s; }
        .step:hover{background:var(--bg-muted)}
        .step-connector { position:absolute;left:33px;bottom:-14px;width:1px;height:28px;background:linear-gradient(to bottom,var(--border-md),transparent);z-index:0; }
        .step:last-child .step-connector{display:none}
        .step-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
        .step-num { width:22px;height:22px;border-radius:50%;background:var(--secondary);color:var(--primary);font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .step-tag{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--fg-subtle)}
        .step-title{font-size:18px;font-weight:700;letter-spacing:-.3px;margin-bottom:5px}
        .step-desc{font-size:13.5px;line-height:1.72;color:var(--fg-muted)}
        .phone { width:234px;background:var(--p900);border-radius:34px;padding:12px;box-shadow:0 40px 80px rgba(7,17,30,.28),0 0 0 1px rgba(255,255,255,.05),inset 0 0 0 1px rgba(255,255,255,.04); }
        .phone-screen{background:var(--bg-muted);border-radius:24px;overflow:hidden;height:430px}
        .phone-status{background:var(--bg-card);height:38px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--border)}
        .phone-pill{width:74px;height:20px;background:var(--p900);border-radius:100px}
        .phone-body{padding:10px;display:flex;flex-direction:column;gap:7px}
        .phone-search{background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--r-lg);padding:8px 10px;display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--fg-muted)}
        .phone-ec{background:var(--bg-card);border:1px solid var(--border);border-radius:11px;padding:9px;display:flex;align-items:center;gap:7px}
        .phone-av{width:30px;height:30px;border-radius:50%;flex-shrink:0}
        .phone-info{flex:1}.ph-line{height:7px;border-radius:3px;background:var(--bg-muted);margin-bottom:4px}.ph-line.s{width:55%}
        .ph-stars{display:flex;gap:1px}.ph-star{font-size:8.5px;color:var(--gold400)}
        .p-float { position:absolute;background:var(--bg-card);border:1px solid var(--border-md);border-radius:13px;padding:9px 13px;display:flex;align-items:center;gap:7px;box-shadow:0 6px 20px rgba(7,17,30,.1);white-space:nowrap; }
        .pf-top{top:-10px;right:-42px;animation:float 3s ease-in-out infinite}.pf-bot{bottom:44px;left:-50px;animation:float 3s ease-in-out 1.5s infinite}
        .pf-icon{width:26px;height:26px;border-radius:7px;background:rgba(129,185,233,.15);display:flex;align-items:center;justify-content:center;font-size:13px}
        .pf-title{font-size:12px;font-weight:700;color:var(--fg)}.pf-sub{font-size:10.5px;color:var(--fg-muted)}
        #stats{padding:0 40px 80px}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .stat-card{border-radius:var(--r-2xl);padding:30px 26px;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:4px}
        .sc-sky{background:var(--s400)}.sc-sand{background:var(--sand400)}.sc-mist{background:var(--mist400)}.sc-gold{background:var(--gold400)}
        .stat-card::after{content:'';position:absolute;inset:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.12'/%3E%3C/svg%3E");mix-blend-mode:overlay;opacity:.5}
        .stat-badge{display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.55);border-radius:50%;width:48px;height:48px;margin-bottom:10px}
        .stat-badge-val{font-size:17px;font-weight:800;color:var(--primary)}
        .stat-num{font-size:34px;font-weight:800;color:rgba(7,17,30,.82);letter-spacing:-1px;line-height:1}
        .stat-lbl{font-size:12.5px;font-weight:600;color:rgba(7,17,30,.55);line-height:1.4}
        #experts{padding:80px 40px}
        .experts-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .expert-card{border-radius:var(--r-2xl);overflow:hidden;background:var(--bg-card);box-shadow:var(--card-ring),var(--card-inset);cursor:pointer;transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s}
        .expert-card:hover{transform:translateY(-6px);box-shadow:0 20px 48px rgba(7,17,30,.1),var(--card-inset)}
        .dark .expert-card:hover{box-shadow:0 20px 48px rgba(0,0,0,.4),var(--card-inset)}
        .expert-img{height:196px;position:relative;overflow:hidden}
        .expert-bg{width:100%;height:100%;transition:transform .55s ease}
        .expert-card:hover .expert-bg{transform:scale(1.06)}
        .expert-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,17,30,.45),transparent 60%)}
        .expert-tag{position:absolute;bottom:9px;left:9px;background:var(--secondary);color:var(--primary);font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:3px 8px;border-radius:var(--r-full)}
        .expert-body{padding:14px 16px 16px}
        .expert-name{font-size:14px;font-weight:700;margin-bottom:2px}.expert-role{font-size:12px;color:var(--fg-muted);margin-bottom:12px}
        .expert-foot{display:flex;align-items:center;justify-content:space-between}
        .e-stars{font-size:10px;color:var(--gold400);letter-spacing:1.5px}.e-rating{font-size:12px;font-weight:700}.e-reviews{font-size:11px;color:var(--fg-muted)}
        .e-btn{height:26px;padding:0 11px;background:rgba(129,185,233,.1);border:1px solid rgba(129,185,233,.2);border-radius:var(--r-lg);font-family:'Manrope',sans-serif;font-size:11px;font-weight:700;color:var(--s700);cursor:pointer;transition:background .15s}
        .dark .e-btn{color:var(--secondary)}.e-btn:hover{background:rgba(129,185,233,.22)}
        .see-more{margin-top:40px;text-align:center}
        #testimonials{padding:80px 40px}
        .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .testi-card{background:var(--bg-card);border-radius:var(--r-2xl);padding:26px;display:flex;flex-direction:column;gap:16px;box-shadow:var(--card-ring),var(--card-inset);transition:transform .25s,box-shadow .25s}
        .testi-card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(7,17,30,.07),0 0 0 1px rgba(129,185,233,.2),var(--card-inset)}
        .t-stars{font-size:12px;color:var(--gold400);letter-spacing:2px}.t-text{font-size:14px;line-height:1.76;color:var(--fg);flex:1}
        .t-author{display:flex;align-items:center;gap:10px}
        .t-av{width:34px;height:34px;border-radius:50%;flex-shrink:0}
        .t-name{font-size:13px;font-weight:700}.t-meta{font-size:11px;color:var(--fg-muted);margin-top:1px}
        .av-a{background:linear-gradient(135deg,var(--s300),var(--s500))}.av-b{background:linear-gradient(135deg,var(--sand200),var(--sand500))}.av-c{background:linear-gradient(135deg,var(--mist200),var(--mist500))}.av-d{background:linear-gradient(135deg,var(--gold100),var(--gold400))}
        #cta{margin:0 40px 80px;border-radius:var(--r-2xl);overflow:hidden}
        .cta-inner{background:linear-gradient(to right,var(--p800) 0%,#1A3050 55%,var(--s800) 100%);padding:68px 56px;display:flex;align-items:center;justify-content:space-between;gap:40px;position:relative}
        .cta-orb{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(129,185,233,.28),transparent 70%)}
        .cta-orb-1{width:380px;height:380px;top:-100px;right:-20px}.cta-orb-2{width:180px;height:180px;bottom:-60px;left:220px;opacity:.5}
        .cta-left{position:relative;z-index:1;max-width:480px}
        .cta-eyebrow{display:inline-flex;align-items:center;gap:6px;background:rgba(129,185,233,.14);border:1px solid rgba(129,185,233,.22);color:var(--s300);font-size:11px;font-weight:700;padding:4px 11px;border-radius:var(--r-full);letter-spacing:.05em;text-transform:uppercase;margin-bottom:16px}
        .cta-title{font-size:clamp(26px,2.8vw,40px);font-weight:800;color:#fff;letter-spacing:-1px;line-height:1.1;margin-bottom:12px}
        .cta-title em{font-style:normal;color:var(--s300)}
        .cta-desc{font-size:14.5px;line-height:1.68;color:rgba(240,246,255,.5)}
        .cta-right{position:relative;z-index:1}
        .cta-form{background:rgba(255,255,255,.06);border:1px solid rgba(129,185,233,.18);border-radius:var(--r-xl);padding:6px 6px 6px 18px;display:flex;gap:8px;min-width:300px}
        .cta-input{flex:1;background:none;border:none;outline:none;color:#fff;font-family:'Manrope',sans-serif;font-size:14px}
        .cta-input::placeholder{color:rgba(240,246,255,.3)}
        .cta-btn{height:36px;padding:0 18px;background:var(--secondary);color:var(--primary);border:none;cursor:pointer;border-radius:var(--r-lg);font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;transition:opacity .15s,transform .2s;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center}
        .cta-btn:hover{opacity:.9;transform:scale(1.02)}
        footer{padding:52px 40px 32px;border-top:1px solid var(--border)}
        .footer-top{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr 1fr;gap:36px;margin-bottom:36px}
        .footer-logo{display:flex;align-items:center;gap:7px;font-size:15px;font-weight:800;color:var(--fg);text-decoration:none;margin-bottom:12px}
        .footer-logo-mark{width:24px;height:24px;border-radius:var(--r-md);background:linear-gradient(135deg,var(--s600),var(--s400));display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:800}
        .footer-desc{font-size:13px;line-height:1.72;color:var(--fg-muted);margin-bottom:18px;max-width:230px}
        .footer-socials{display:flex;gap:6px}
        .soc-btn{width:30px;height:30px;border-radius:var(--r-lg);border:1px solid var(--border-md);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--fg-muted);text-decoration:none;transition:color .15s,background .15s}
        .soc-btn:hover{color:var(--fg);background:var(--bg-muted)}
        .fc-title{font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--fg);margin-bottom:14px}
        .fc-links{list-style:none;display:flex;flex-direction:column;gap:9px}
        .fc-links a{font-size:13px;color:var(--fg-muted);text-decoration:none;transition:color .15s}
        .fc-links a:hover{color:var(--fg)}
        .footer-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:26px;border-top:1px solid var(--border);font-size:12px;color:var(--fg-subtle)}
        .fb-links{display:flex;gap:18px}
        .fb-links a{color:var(--fg-subtle);text-decoration:none;transition:color .15s}
        .fb-links a:hover{color:var(--fg-muted)}
        .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
        .reveal.in{opacity:1;transform:translateY(0)}
        .d1{transition-delay:.07s}.d2{transition-delay:.14s}.d3{transition-delay:.21s}.d4{transition-delay:.28s}
        @media(max-width:1080px){
          #hero{grid-template-columns:1fr}.hero-right{display:none}
          .cat-grid{grid-template-columns:repeat(3,1fr)}
          .wwh-row{grid-template-columns:1fr;gap:40px;padding:72px 40px}
          .wwh-flip .wwh-text{order:1}.wwh-flip .wwh-visual{order:2}
          .why-vis-grid{max-width:100%}
          .stats-grid{grid-template-columns:repeat(2,1fr)}
          .experts-grid{grid-template-columns:repeat(2,1fr)}
          .testi-grid{grid-template-columns:repeat(2,1fr)}
          #cta{margin:0 24px 72px}.cta-inner{flex-direction:column;padding:52px 40px}.cta-form{min-width:auto;width:100%}
          .footer-top{grid-template-columns:1fr 1fr;gap:28px}
        }
        @media(max-width:768px){
          nav{padding:0 20px}.nav-links{display:none}
          #hero{padding:88px 20px 60px}
          #categories,#experts,#testimonials{padding:60px 20px}
          .wwh-row{padding:60px 20px}
          #stats{padding:0 20px 60px}
          .stats-grid,.cat-grid{grid-template-columns:repeat(2,1fr)}
          .experts-grid{grid-template-columns:1fr 1fr}
          .testi-grid{grid-template-columns:1fr}
          .sec-header-row{flex-direction:column;gap:14px;align-items:flex-start}
          #cta{margin:0;border-radius:0}.cta-inner{padding:48px 20px}
          footer{padding:44px 20px 28px}
          .footer-top{grid-template-columns:1fr}
          .footer-bottom{flex-direction:column;gap:14px;text-align:center}
        }
      `}</style>

      {/* NAV */}
      <nav id="lp-nav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">B</div>
          buildinghelp
        </a>
        <ul className="nav-links">
          <li><a href="#what">What it is</a></li>
          <li><a href="#why">Why us</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#experts">Experts</a></li>
          <li><a href="#testimonials">Reviews</a></li>
        </ul>
        <div className="nav-right">
          <button className="nav-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" style={{display:'none'}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
            </svg>
            <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
            </svg>
          </button>
          <a href="/signup" className="btn-nav">Get Started →</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-mesh"></div>
        <div className="hero-left">
          <div className="eyebrow"><span className="eyebrow-dot"></span>10M+ members helped worldwide</div>
          <h1 className="hero-h1">
            <span className="line"><span className="word w1">Dream.</span></span>
            <span className="line"><span className="word w2">Design.</span></span>
            <span className="line"><span className="word w3 grad-text">Build</span></span>
            <span className="line"><span className="word w4">It.</span></span>
          </h1>
          <p className="hero-desc">Connect with world-class architects, interior designers, and construction experts. Your vision, expertly realized — from concept to completion.</p>
          <div className="hero-actions">
            <a href="/signup" className="btn-primary">Consult an Expert →</a>
            <a href="#what" className="btn-ghost">How it works</a>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars">
              <div className="proof-av pa1"></div><div className="proof-av pa2"></div>
              <div className="proof-av pa3"></div><div className="proof-av pa4"></div>
            </div>
            <div className="proof-text"><strong>12,000+</strong> verified experts<br />ready to help you today</div>
          </div>
        </div>
        <div className="hero-right">
          <div className="htile t1"><div className="tile-grad"></div><span className="tile-label">Architecture</span></div>
          <div className="htile t2"><div className="tile-grad"></div><span className="tile-label">Interior</span></div>
          <div className="htile t3"><div className="tile-grad"></div><span className="tile-label">Landscape</span></div>
          <div className="htile t4"><div className="tile-grad"></div><span className="tile-label">Modern</span></div>
          <div className="htile t5"><div className="tile-grad"></div><span className="tile-label">Urban</span></div>
          <div className="htile t6"><div className="tile-grad"></div><span className="tile-label">Industrial</span></div>
          <div className="hero-float hf-top">
            <div className="hf-icon hf-blue">⚡</div>
            <div><div className="hf-title">Matched in 2 min</div><div className="hf-sub">Average response time</div></div>
          </div>
          <div className="hero-float hf-bot">
            <div className="hf-icon hf-sand">★</div>
            <div><div className="hf-title">4.9 avg rating</div><div className="hf-sub">From 340k+ reviews</div></div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {['Residential Design','Interior Architecture','Urban Planning','Landscape Design','Commercial Spaces','Sustainable Build','Expert Consultation','Construction'].flatMap((item, i) => [
            <span key={`a${i}`} className={`marquee-item${i % 2 === 0 ? ' hi' : ''}`}>{item}</span>,
            <span key={`sa${i}`} className="marquee-sep"></span>,
          ]).concat(
            ['Residential Design','Interior Architecture','Urban Planning','Landscape Design','Commercial Spaces','Sustainable Build','Expert Consultation','Construction'].flatMap((item, i) => [
              <span key={`b${i}`} className={`marquee-item${i % 2 === 0 ? ' hi' : ''}`}>{item}</span>,
              <span key={`sb${i}`} className="marquee-sep"></span>,
            ])
          )}
        </div>
      </div>

      {/* CATEGORIES */}
      <section id="categories">
        <div className="sec-header">
          <p className="sec-label reveal">Browse by expertise</p>
          <h2 className="sec-title reveal d1">Find your perfect<br />expert match</h2>
        </div>
        <div className="cat-grid">
          {[
            { icon: '🏠', name: 'Residential Architect', count: '2,400+' },
            { icon: '🛋️', name: 'Interior Architect', count: '3,100+' },
            { icon: '🌿', name: 'Landscape Architect', count: '1,800+' },
            { icon: '🏙️', name: 'Urban Design', count: '900+' },
            { icon: '🔨', name: 'Construction', count: '4,200+' },
          ].map((c, i) => (
            <div className={`cat-card reveal d${i + 1}`} key={c.name}>
              <div className="cat-topbar"></div>
              <div className="cat-icon">{c.icon}</div>
              <div><div className="cat-name">{c.name}</div><div className="cat-count">{c.count} experts</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT */}
      <section id="what">
        <div className="wwh-row">
          <div className="wwh-text">
            <p className="sec-label reveal">What it is</p>
            <h2 className="wwh-title reveal d1">Expert architecture advice,<br />whenever you need it.</h2>
            <p className="wwh-desc reveal d2">Buildinghelp connects homeowners, developers, and builders with verified architects, interior designers, and construction specialists — matched in under 2 minutes. From first concept to final build, your expert is always here.</p>
            <a href="/signup" className="btn-primary reveal d3" style={{alignSelf:'flex-start',marginTop:'4px'}}>Start for free →</a>
          </div>
          <div className="wwh-visual reveal d1">
            <div className="browser">
              <div className="browser-bar">
                <span className="bwdot bwd1"></span><span className="bwdot bwd2"></span><span className="bwdot bwd3"></span>
                <div className="browser-url">buildinghelp.com/experts</div>
              </div>
              <div className="browser-body">
                <div className="bb-header">
                  <span className="bb-title">12,000+ Verified Experts</span>
                  <span className="bb-badge">🟢 Online now</span>
                </div>
                {[
                  { av: 'av-a', name: 'Sarah Chen', role: 'Residential Architect · MIT' },
                  { av: 'av-b', name: 'Marcus Reed', role: 'Interior Architect · RCA London' },
                  { av: 'av-c', name: 'Priya Nair', role: 'Landscape Architect · UCL' },
                ].map(e => (
                  <div className="bb-card" key={e.name}>
                    <div className={`bb-av ${e.av}`}></div>
                    <div className="bb-info">
                      <div className="bb-name">{e.name}</div>
                      <div className="bb-role">{e.role}</div>
                      <div className="bb-stars">★★★★★</div>
                    </div>
                    <button className="bb-cta">Consult</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how">
        <div className="wwh-row wwh-flip">
          <div className="wwh-text">
            <p className="sec-label reveal">How it works</p>
            <h2 className="wwh-title reveal d1">Three steps.<br />Under two minutes.</h2>
            <div className="steps reveal d2" style={{marginTop:'8px'}}>
              {[
                { n: 1, tag: 'Ask', title: 'Ask your question', desc: 'Tell us your challenge in any category, any time. Our system understands what you need.' },
                { n: 2, tag: 'Match', title: 'We match you instantly', desc: 'Connected in minutes with the best verified expert — no waiting, no searching.' },
                { n: 3, tag: 'Build', title: 'Chat with an expert', desc: 'Talk, text, or call till you have your answer. Members get unlimited consultations 24/7.' },
              ].map((s, i) => (
                <div className="step" key={s.n}>
                  <div className="step-head"><div className="step-num">{s.n}</div><span className="step-tag">{s.tag}</span></div>
                  <div className="step-title">{s.title}</div>
                  <p className="step-desc">{s.desc}</p>
                  {i < 2 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="wwh-visual reveal d1">
            <div className="phone">
              <div className="p-float pf-top">
                <div className="pf-icon">⚡</div>
                <div><div className="pf-title">Matched instantly</div><div className="pf-sub">Under 2 minutes</div></div>
              </div>
              <div className="phone-screen">
                <div className="phone-status"><div className="phone-pill"></div></div>
                <div className="phone-body">
                  <div className="phone-search"><span style={{fontSize:'12px'}}>🔍</span> Find an architect…</div>
                  {(['av-a','av-b','av-c','av-d'] as const).map(av => (
                    <div className="phone-ec" key={av}>
                      <div className={`phone-av ${av}`}></div>
                      <div className="phone-info">
                        <div className="ph-line"></div><div className="ph-line s"></div>
                        <div className="ph-stars"><span className="ph-star">★</span><span className="ph-star">★</span><span className="ph-star">★</span><span className="ph-star">★</span><span className="ph-star">★</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-float pf-bot">
                <div className="pf-icon">✓</div>
                <div><div className="pf-title">4.9 avg rating</div><div className="pf-sub">Verified reviews</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats">
        <div className="stats-grid">
          {[
            { cls:'sc-sky',  badge:'12k',  target:'12000', suffix:'+',  lbl:'Verified experts\nglobally' },
            { cls:'sc-sand', badge:'10M',  target:'10',    suffix:'M+', lbl:'Members helped\nworldwide' },
            { cls:'sc-mist', badge:'4.9',  target:'4.9',   suffix:'★',  dec:'1', lbl:'Average expert\nsatisfaction rating' },
            { cls:'sc-gold', badge:'24/7', target:'24',    suffix:'/7', lbl:'Expert availability\naround the clock' },
          ].map((s, i) => (
            <div className={`stat-card ${s.cls} reveal d${i+1}`} key={s.cls}>
              <div className="stat-badge"><span className="stat-badge-val">{s.badge}</span></div>
              <div className="stat-num"><span className="counter" data-target={s.target} data-suffix={s.suffix} {...(s.dec ? {'data-decimal': s.dec} : {})}>0</span></div>
              <div className="stat-lbl">{s.lbl.split('\n').map((l,j) => <span key={j}>{l}{j===0&&<br/>}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERTS */}
      <section id="experts">
        <div className="sec-header-row">
          <div>
            <p className="sec-label reveal">Our network</p>
            <h2 className="sec-title reveal d1">Meet the Experts</h2>
          </div>
          <a href="/signup" className="btn-outline reveal">Browse all →</a>
        </div>
        <div className="experts-grid">
          {[
            { bg:'linear-gradient(145deg,var(--s200),var(--s500))',    tag:'Residential', name:'Sarah Chen',   role:'Residential Architect · MIT',     rating:'4.9', reviews:'342' },
            { bg:'linear-gradient(145deg,var(--sand200),var(--sand500))', tag:'Interior',    name:'Marcus Reed',  role:'Interior Architect · RCA London',  rating:'5.0', reviews:'218' },
            { bg:'linear-gradient(145deg,var(--mist200),var(--mist500))', tag:'Landscape',   name:'Priya Nair',   role:'Landscape Architect · UCL',        rating:'4.8', reviews:'156' },
            { bg:'linear-gradient(145deg,var(--gold100),var(--gold400))', tag:'Urban',       name:'James Okafor', role:'Urban Designer · Yale',            rating:'4.9', reviews:'289' },
          ].map((e, i) => (
            <div className={`expert-card reveal d${i+1}`} key={e.name}>
              <div className="expert-img">
                <div className="expert-bg" style={{background:e.bg,height:'100%'}}></div>
                <div className="expert-grad"></div>
                <div className="expert-tag">{e.tag}</div>
              </div>
              <div className="expert-body">
                <div className="expert-name">{e.name}</div>
                <div className="expert-role">{e.role}</div>
                <div className="expert-foot">
                  <div><div className="e-stars">★★★★★</div><span className="e-rating">{e.rating}</span><span className="e-reviews"> ({e.reviews} reviews)</span></div>
                  <button className="e-btn">Consult</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="see-more reveal"><a href="/signup" className="btn-outline">See More Experts →</a></div>
      </section>

      {/* WHY */}
      <section id="why">
        <div className="wwh-row">
          <div className="wwh-text">
            <p className="sec-label reveal">Why buildinghelp</p>
            <h2 className="wwh-title reveal d1">Stop guessing.<br />Get real answers.</h2>
            <p className="wwh-desc reveal d2">Finding the right professional used to take weeks of calls, referrals, and dead ends. We fixed that. Every expert is verified, every consultation is private, and help is always one tap away.</p>
            <ul className="wwh-list reveal d3">
              <li><span>✅</span> 8-step verification — licences, skills, and peer review</li>
              <li><span>⚡</span> Connected to the right expert in under 2 minutes</li>
              <li><span>🔒</span> 100% private — your project details stay with you</li>
              <li><span>💬</span> Unlimited consultations, 24/7, any category</li>
            </ul>
          </div>
          <div className="wwh-visual reveal d1">
            <div className="why-vis-grid">
              {[
                { icon:'✅', val:'12k+', sub:'Verified experts worldwide' },
                { icon:'⚡', val:'<2m',  sub:'Average match time' },
                { icon:'★',  val:'4.9',  sub:'Average expert rating' },
                { icon:'💬', val:'24/7', sub:'Always available, always private' },
              ].map(c => (
                <div className="why-vis-card" key={c.val}>
                  <div className="why-vis-icon">{c.icon}</div>
                  <div className="why-vis-val">{c.val}</div>
                  <div className="why-vis-sub">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="sec-header-row">
          <div>
            <p className="sec-label reveal">What members say</p>
            <h2 className="sec-title reveal d1">Over 10 million<br />members helped</h2>
          </div>
        </div>
        <div className="testi-grid">
          {[
            { av:'av-a', text:'"Buildinghelp connected me with an incredible architect who completely transformed my vision into reality. The process was seamless and incredibly fast."', name:'Lincoln Ekström', meta:'Residential project · Stockholm' },
            { av:'av-b', text:'"I had been struggling to find the right interior designer for months. Within 2 minutes I had three incredible matches. Absolutely brilliant."', name:'Abram Herwitz', meta:'Interior project · New York' },
            { av:'av-c', text:'"The experts on Buildinghelp are genuinely world-class. My landscape project came out better than I could have ever imagined. Worth every penny."', name:'Jakob Lubin', meta:'Landscape project · Berlin' },
          ].map((t, i) => (
            <div className={`testi-card reveal d${i+1}`} key={t.name}>
              <div className="t-stars">★★★★★</div>
              <p className="t-text">{t.text}</p>
              <div className="t-author">
                <div className={`t-av ${t.av}`}></div>
                <div><div className="t-name">{t.name}</div><div className="t-meta">{t.meta}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="cta-inner">
          <div className="cta-orb cta-orb-1"></div>
          <div className="cta-orb cta-orb-2"></div>
          <div className="cta-left">
            <div className="cta-eyebrow">✦ Join free today</div>
            <h2 className="cta-title reveal">Ask us <em>anything.</em><br />Day or night.</h2>
            <p className="cta-desc reveal d1">The experts at Buildinghelp are ready to answer your questions anytime. Join over 10 million members who&apos;ve already made their dream a reality.</p>
          </div>
          <div className="cta-right reveal d2">
            <div className="cta-form">
              <input className="cta-input" type="email" placeholder="Enter your email to get started…" />
              <a href="/signup" className="cta-btn">Join Free →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <a href="#" className="footer-logo"><div className="footer-logo-mark">B</div>buildinghelp</a>
            <p className="footer-desc">Connecting dreamers with world-class design and construction experts since 2012.</p>
            <div className="footer-socials">
              <a href="#" className="soc-btn">f</a><a href="#" className="soc-btn">𝕏</a>
              <a href="#" className="soc-btn">in</a><a href="#" className="soc-btn">ig</a>
            </div>
          </div>
          {[
            { title:'Buildinghelp', links:['Home','About','Careers','Press','Blog'] },
            { title:'Members',      links:['How it works','Log in','Create account','Categories'] },
            { title:'Experts',      links:['Meet the Experts','Expert Login','Become an Expert'] },
            { title:'Support',      links:['Help centre','Contact us','Trust & Safety'] },
          ].map(col => (
            <div key={col.title}>
              <div className="fc-title">{col.title}</div>
              <ul className="fc-links">{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2025 Buildinghelp, Inc. All rights reserved.</span>
          <div className="fb-links">
            <a href="#">Sitemap</a><a href="#">Terms of service</a><a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </>
  )
}
