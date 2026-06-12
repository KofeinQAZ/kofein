import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import navbarIcon from "@/assets/navbar-icon.svg";

const INSTAGRAM_URL = "https://instagram.com/kapash.rsl";
const EMAIL_ADDRESS = "kapasrasul@gmail.com";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/portfolio", label: "Работы" },
  { to: "#", label: "Резюме", external: true, href: "https://drive.google.com/file/d/18WDb51psQinuYIINGwOUg7XXS5eGpgbP/view?usp=sharing" },
  { to: "/contacts", label: "Контакты" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overDarkSection, setOverDarkSection] = useState(false);
  const location = useLocation();

  // Detect when navbar overlaps a section flagged data-nav-theme="dark"
  useEffect(() => {
    setOverDarkSection(false);
    const check = () => {
      const els = document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]');
      const probeY = 40; // top of viewport just under navbar
      let isDark = false;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) isDark = true;
      });
      setOverDarkSection(isDark);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [location.pathname]);

  // Inverted logo on non-home pages OR when over dark scroll section
  const isDarkBackground = location.pathname !== "/" || overDarkSection;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 pt-6 px-6 md:px-12 pointer-events-none"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* Логотип (слева) с динамическим цветом */}
        <Link to="/" className="pointer-events-auto hover:opacity-80 transition-opacity z-10 flex-shrink-0">
          <img 
            src={navbarIcon} 
            alt="Rasul Kapash" 
            className={`h-7 md:h-8 w-auto transition-all duration-300 ${
              isDarkBackground ? "brightness-0 invert" : ""
            }`} 
          />
        </Link>

        {/* Десктопное меню (центрированная белая "таблетка") */}
        <nav className="hidden md:flex items-center gap-1 bg-white px-1.5 py-1.5 rounded-full shadow-sm pointer-events-auto absolute left-1/2 transform -translate-x-1/2 border border-gray-100">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.to;
            // Стили для активного элемента (с тонкой черной обводкой) и обычного
            const baseClass = "text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 border";
            const activeClass = isActive 
              ? "border-black text-black bg-transparent" 
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-100";

            return link.external ? (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClass} border-transparent text-gray-500 hover:text-black hover:bg-gray-100`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                {link.label}
              </motion.a>
            ) : (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Link to={link.to} className={`${baseClass} ${activeClass}`}>
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right side: social buttons (desktop) + burger (mobile) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden md:inline-flex pointer-events-auto bg-white text-black p-2.5 rounded-full shadow-sm border border-gray-100 hover:bg-black hover:text-white transition-colors"
          >
            <Instagram size={18} />
          </a>
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            aria-label="Написать на почту"
            className="hidden md:inline-flex pointer-events-auto bg-white text-black p-2.5 rounded-full shadow-sm border border-gray-100 hover:bg-black hover:text-white transition-colors"
          >
            <Mail size={18} />
          </a>

          {/* Бургер для мобилок (справа) - всегда на белом фоне для видимости */}
          <button
            className="md:hidden pointer-events-auto bg-white text-black p-2.5 rounded-full shadow-sm border border-gray-100 z-50 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Выпадающее мобильное меню */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden absolute top-20 right-6 left-6 bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-auto border border-gray-100"
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.to;
                const baseMobileClass = "text-sm font-medium px-4 py-3 rounded-xl transition-all border";
                const activeMobileClass = isActive 
                  ? "border-black text-black bg-transparent" 
                  : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50";

                return link.external ? (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className={`${baseMobileClass} border-transparent text-gray-500 hover:text-black hover:bg-gray-50`}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {link.label}
                  </motion.a>
                ) : (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`block ${baseMobileClass} ${activeMobileClass}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
