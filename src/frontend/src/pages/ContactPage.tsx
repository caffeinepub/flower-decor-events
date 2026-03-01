import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 86606 10864",
    href: "tel:+918660610864",
  },
  {
    icon: Mail,
    label: "Email",
    value: "kalapriyadecorations@gmail.com",
    href: "mailto:kalapriyadecorations@gmail.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Bangalore, Karnataka, India",
    href: "https://maps.google.com/?q=Bangalore,Karnataka,India",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Opens a mailto with prefilled content
    const subject = encodeURIComponent(`Enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    );
    window.open(
      `mailto:kalapriyadecorations@gmail.com?subject=${subject}&body=${body}`,
    );
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-3">
          Contact Us
        </h1>
        <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
          We'd love to hear from you. Reach out to book a decoration or ask any
          questions.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact details */}
        <div className="flex flex-col gap-6">
          <div
            className="rounded-2xl p-8 shadow-festival border border-border/40"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0.02 70 / 0.6), oklch(0.97 0.015 340 / 0.4))",
            }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Get In Touch
            </h2>
            <div className="flex flex-col gap-5">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-gold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="font-body text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-body text-foreground font-medium">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp quick button */}
          <a
            href="https://wa.me/918660610864?text=Hi%2C%20I%27m%20interested%20in%20your%20flower%20decoration%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-3.5 rounded-2xl font-body font-semibold text-white transition-transform hover:scale-[1.02] active:scale-100 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
            }}
          >
            {/* WhatsApp icon */}
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Enquiry form */}
        <div
          className="rounded-2xl p-8 shadow-festival border border-border/40"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.98 0.01 60 / 0.7), oklch(0.97 0.01 0 / 0.4))",
          }}
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Send an Enquiry
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="contact-name"
                className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block"
              >
                Your Name *
              </label>
              <Input
                id="contact-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="font-body"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block"
              >
                Email Address *
              </label>
              <Input
                id="contact-email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="font-body"
              />
            </div>
            <div>
              <label
                htmlFor="contact-phone"
                className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block"
              >
                Phone Number
              </label>
              <Input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="font-body"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block"
              >
                Message *
              </label>
              <Textarea
                id="contact-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your event, date, and requirements..."
                className="font-body min-h-[120px] resize-none"
              />
            </div>
            <Button
              type="submit"
              className="mt-1 gap-2 font-body font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
              }}
            >
              <Send className="w-4 h-4" />
              {sent ? "Opening email client..." : "Send Enquiry"}
            </Button>
            <p className="text-xs text-muted-foreground font-body text-center">
              This will open your email app with the message pre-filled.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
