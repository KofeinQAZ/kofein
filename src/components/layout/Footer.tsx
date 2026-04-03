const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Rasul Kapash. Все права защищены.</p>
        <div className="flex items-center gap-6">
          <a href="mailto:kapasrasul@gmail.com" className="hover:text-primary transition-colors">
            Email
          </a>
          <a href="https://kofeingallery.framer.website" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Сайт
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
