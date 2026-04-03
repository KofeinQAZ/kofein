import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Contacts = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <h1 className="heading-display text-5xl md:text-7xl text-foreground mb-16">
        Контакты
      </h1>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact info */}
        <div className="space-y-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Открыт для сотрудничества и новых проектов. Свяжитесь со мной
            любым удобным способом.
          </p>

          <div className="space-y-6">
            <a
              href="mailto:kapasrasul@gmail.com"
              className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">kapasrasul@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+77080781410"
              className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Телефон</p>
                <p className="font-medium">+7 (708) 078 1410</p>
              </div>
            </a>

            <div className="flex items-center gap-4 text-foreground">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Локация</p>
                <p className="font-medium">Алматы, Казахстан</p>
              </div>
            </div>

            <a
              href="https://kofeingallery.framer.website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                <ExternalLink size={18} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Сайт</p>
                <p className="font-medium">kofeingallery.framer.website</p>
              </div>
            </a>
          </div>
        </div>

        {/* Contact form */}
        <form
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
        >
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Имя</label>
            <input
              name="name"
              required
              maxLength={100}
              className="w-full bg-transparent border-b border-border py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              maxLength={255}
              className="w-full bg-transparent border-b border-border py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Сообщение</label>
            <textarea
              name="message"
              required
              maxLength={1000}
              rows={4}
              className="w-full bg-transparent border-b border-border py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Расскажите о вашем проекте..."
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            Отправить
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contacts;
