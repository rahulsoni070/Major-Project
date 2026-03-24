function Footer() {
  return (
    <footer className="site-footer mt-auto">
      <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span>© {new Date().getFullYear()} ShopEasy</span>
        <span>Built with React • Bootstrap • Vercel</span>
      </div>
    </footer>
  );
}

export default Footer;