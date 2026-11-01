import { useEffect, useMemo, useState } from 'react'
import { countdown, manias } from './data/manias'
import './App.css'

function App() {
  const [selectedId, setSelectedId] = useState('wm17')
  const [videoId, setVideoId] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const selected = useMemo(
    () => manias.find((m) => m.id === selectedId) ?? manias[manias.length - 1],
    [selectedId],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setVideoId(null)
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const i = countdown.findIndex((m) => m.id === selectedId)
      const next = e.key === 'ArrowRight' ? i + 1 : i - 1
      if (countdown[next]) setSelectedId(countdown[next].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  const goTo = (id) => {
    setSelectedId(id)
    setMenuOpen(false)
    document.getElementById('spotlight')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark">WM</span>
          <span>
            TOP 10
            <small>Grandest Stage</small>
          </span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'open' : ''}>
          <a href="#ranking" onClick={() => setMenuOpen(false)}>
            Ranking
          </a>
          <a href="#spotlight" onClick={() => setMenuOpen(false)}>
            Spotlight
          </a>
          <a href="#carteleras" onClick={() => setMenuOpen(false)}>
            Carteleras
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <img src="/hero-mania.jpg" alt="" className="hero-bg" />
        <div className="hero-veil" />
        <div className="hero-copy">
          <p className="kicker">WWE · The Showcase of the Immortals</p>
          <h1>
            Las 10 mejores
            <em> WrestleManias</em>
          </h1>
          <p className="lede">
            Un top personal, del 10 al 1. Carteleras, fotos de los combates y
            highlights oficiales de WWE para revivir cada noche.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn gold" onClick={() => goTo('wm17')}>
              Ir al #1 · X-Seven
            </button>
            <a className="btn ghost" href="#ranking">
              Empezar en el #10
            </a>
          </div>
        </div>
      </section>

      <section className="ranking" id="ranking">
        <div className="section-head">
          <p className="kicker">Del 10 al 1</p>
          <h2>El ranking</h2>
          <p>Elige una Mania. Flechas del teclado para recorrer el top.</p>
        </div>
        <div className="rank-grid">
          {countdown.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`rank-card ${m.id === selectedId ? 'active' : ''}`}
              onClick={() => goTo(m.id)}
            >
              <img src={m.poster} alt={`Cartel de ${m.title}`} />
              <div>
                <span className="rank-num">#{m.rank}</span>
                <h3>{m.title}</h3>
                <p>
                  {m.city} · {m.date}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="spotlight" id="spotlight">
        <div className="spot-poster">
          <p className="rank-badge">Puesto #{selected.rank}</p>
          <img src={selected.poster} alt={`Match card de ${selected.title}`} />
        </div>
        <div className="spot-copy">
          <p className="kicker">
            {selected.era} · {selected.roman}
          </p>
          <h2>{selected.title}</h2>
          <p className="tag">{selected.tagline}</p>
          <ul className="meta">
            <li>
              <span>Fecha</span>
              {selected.date}
            </li>
            <li>
              <span>Ciudad</span>
              {selected.city}
            </li>
            <li>
              <span>Venue</span>
              {selected.venue}
            </li>
            <li>
              <span>Público</span>
              {selected.attendance}
            </li>
          </ul>
          <p className="why">{selected.why}</p>
          <p className="main-event">
            <span>Main event</span>
            {selected.mainEvent}
          </p>
        </div>
      </section>

      <section className="card-section" id="carteleras">
        <div className="section-head">
          <p className="kicker">Match card</p>
          <h2>Cartelera de {selected.title}</h2>
        </div>
        <ol className="match-list">
          {selected.card.map((bout) => (
            <li key={bout.result}>
              <div>
                <strong>{bout.result}</strong>
                <span>{bout.stip}</span>
              </div>
              <em>{bout.time}</em>
            </li>
          ))}
        </ol>
      </section>

      <section className="videos">
        <div className="section-head">
          <p className="kicker">Combates</p>
          <h2>Fotos y highlights</h2>
          <p>Miniaturas oficiales de YouTube. Clic para reproducir el video de WWE.</p>
        </div>
        <div className="video-grid">
          {selected.highlights.map((h) => (
            <article key={h.youtube} className="video-card">
              <button type="button" onClick={() => setVideoId(h.youtube)}>
                <img src={h.photo} alt={h.title} />
                <span className="play">▶</span>
              </button>
              <h3>{h.title}</h3>
              <p>{h.note}</p>
              <a
                href={`https://www.youtube.com/watch?v=${h.youtube}`}
                target="_blank"
                rel="noreferrer"
              >
                Abrir en YouTube
              </a>
            </article>
          ))}
        </div>
      </section>

      {videoId && (
        <div className="modal" onClick={() => setVideoId(null)}>
          <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close" onClick={() => setVideoId(null)}>
              Cerrar
            </button>
            <iframe
              title="Highlight de WWE"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <footer className="foot">
        <p>
          Top personal de WrestleManias de WWE. Carteles ilustrados para la
          página. Fotos y videos de combates vía canal oficial de WWE en YouTube.
        </p>
      </footer>
    </div>
  )
}

export default App
