import logoMark from '../assets/logo-mark-teal.svg'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--line-soft)' }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '34px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src={logoMark} alt="" style={{ height: 28, width: 'auto' }} />
          <span style={{ fontFamily: 'Raleway, Poppins, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-heading)', letterSpacing: '0.01em' }}>
            Sincero
          </span>
        </a>

        <p style={{ fontFamily: 'Raleway, Poppins, sans-serif', fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          AI INSIGHT. HUMAN JUDGMENT.
        </p>

        <nav style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
          {['Servicios', 'Proceso', 'Clientes', 'Contacto'].map(link => (
            <a key={link} href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12, fontWeight: 500 }}>
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
