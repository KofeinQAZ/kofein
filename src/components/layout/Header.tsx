import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import navbarIcon from "@/assets/navbar-icon.svg";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/portfolio", label: "Работы" },
  { to: "#", label: "Резюме", external: true, href: "https://drive.google.com/file/d/18WDb51psQinuYIINGwOUg7XXS5eGpgbP/view?usp=sharing" },
  { to: "/contacts", label: "Контакты" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 pt-6 px-6 md:px-12 pointer-events-none"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* Логотип (слева) */}
        <Link to="/" className="pointer-events-auto hover:opacity-80 transition-opacity z-10 flex-shrink-0">
          <img src={navbarIcon} alt="Rasul Kapash" className="h-7 md:h-8 w-auto" />
        </Link>

        {/* Десктопное меню (центрированная "таблетка") */}
        <nav className="hidden md:flex items-center gap-1 bg-white px-2 py-1.5 rounded-full shadow-lg pointer-events-auto absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.to;
            const baseClass = "text-sm font-medium px-4 py-2 rounded-full transition-all duration-200";
            const activeClass = isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black hover:bg-gray-50";

            return link.external ? (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClass} text-gray-600 hover:text-black hover:bg-gray-50`}
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

        {/* Бургер для мобилок (справа) */}
        <button
          className="md:hidden pointer-events-auto bg-white text-black p-2.5 rounded-full shadow-lg z-50 relative flex-shrink-0"
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

      {/* Выпадающее мобильное меню (парящая карточка) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden absolute top-20 right-6 left-6 bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-100"
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.to;
                const baseMobileClass = "text-sm font-medium px-4 py-3 rounded-xl transition-colors";
                const activeMobileClass = isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black hover:bg-gray-50";

                return link.external ? (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className={`${baseMobileClass} text-gray-600 hover:text-black hover:bg-gray-50`}
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
