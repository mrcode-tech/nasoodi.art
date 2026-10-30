const currentYear = new Date().getFullYear();

export default function Home() {
  return (
    <main>
      <header className="shell site-header">
        <a aria-label="nasoodi.art home" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            n.
          </span>
          <span>nasoodi.art</span>
        </a>
        <span className="header-note">An independent digital space</span>
      </header>

      <section aria-labelledby="hero-title" className="shell hero">
        <div className="eyebrow">
          <span aria-hidden="true" className="eyebrow-dot" />
          A new canvas
        </div>

        <h1 id="hero-title">
          Ideas take
          <br />
          <span>many forms.</span>
        </h1>

        <p className="hero-copy">
          A space for creative ideas, thoughtful experiments, and things worth
          making. The next chapter starts here.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="mailto:hello@nasoodi.art">
            Get in touch <span aria-hidden="true">&nbsp;↗</span>
          </a>
          <a className="button button-secondary" href="#about">
            Discover the space
          </a>
        </div>

        <p className="hero-footnote" id="about">
          Made with curiosity. Built for what comes next.
        </p>
      </section>

      <footer className="shell site-footer">
        <span>© {currentYear} nasoodi.art</span>
        <span>Independent by design.</span>
      </footer>
    </main>
  );
}
