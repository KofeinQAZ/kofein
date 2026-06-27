import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const [clicks, setClicks] = useState(0);
  const navigate = useNavigate();

  const handleSecretClick = () => {
    const next = clicks + 1;
    if (next >= 5) {
      navigate("/login");
      setClicks(0);
    } else {
      setClicks(next);
      setTimeout(() => setClicks(0), 2000);
    }
  };

  return (
    <footer className="border-t border-border py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p
          onClick={handleSecretClick}
          className="cursor-default select-none"
        >
          © {new Date().getFullYear()} Rasul Kapash. Все права защищены.
        </p>
        <div className="flex items-center gap-6">
          <a href="mailto:kapasrasul@gmail.com" className="hover:text-primary transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
