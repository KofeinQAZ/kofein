import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "kapasrasul@gmail.com",
    href: "mailto:kapasrasul@gmail.com",
  },
  {
    icon: Phone,
    label: "Телефон",
    value: "+7 (708) 078 1410",
    href: "tel:+77080781410",
  },
  {
    icon: MapPin,
    label: "Локация",
    value: "Алматы, Казахстан",
  },
  {
    icon: ExternalLink,
    label: "Сайт",
    value: "kofeingallery.framer.website",
    href: "https://kofeingallery.framer.website",
    external: true,
  },
];

const Contacts = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <motion.h1
        className="heading-display text-5xl md:text-7xl text-foreground mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Контакты
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact info */}
        <div className="space-y-8">
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Открыт для сотрудничества и новых проектов. Свяжитесь со мной
            любым удобным способом.
          </motion.p>

          <div className="space-y-6">
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <motion.div
                  className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group"
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon size={18} />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </motion.div>
              );

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {content}
                  </a>
                );
              }
              return <div key={item.label}>{content}</div>;
            })}
          </div>
        </div>

        {/* Contact form */}
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = "kapasrasul@gmail.com";
            const subject = encodeURIComponent(
              `Сообщение от ${formData.get("name")}`
            );
            const body = encodeURIComponent(
              `${formData.get("message")}\n\nОт: ${formData.get("name")}\nEmail: ${formData.get("email")}`
            );
            window.open(`mailto:${email}?subject=${subject}&body=${body}`);
          }}
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {[
            { name: "name", label: "Имя", type: "text", placeholder: "Ваше имя", maxLength: 100 },
            { name: "email", label: "Email", type: "email", placeholder: "your@email.com", maxLength: 255 },
          ].map((field, i) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            >
              <label className="text-sm text-muted-foreground block mb-2">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                required
                maxLength={field.maxLength}
                className="w-full bg-transparent border-b border-border py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder={field.placeholder}
              />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <label className="text-sm text-muted-foreground block mb-2">Сообщение</label>
            <textarea
              name="message"
              required
              maxLength={1000}
              rows={4}
              className="w-full bg-transparent border-b border-border py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Расскажите о вашем проекте..."
            />
          </motion.div>
          <motion.button
            type="submit"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Отправить
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contacts;
