function Footer() {
  return (
    <footer className="site-footer mt-auto">
      <div className="container py-3 d-flex justify-content-center align-items-center">
        <span className="text-center">© {new Date().getFullYear()} ShopEasy</span>
      </div>
    </footer>
  );
}

export default Footer;