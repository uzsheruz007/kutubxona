import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden"
    >
      {/* Decorative Backgrounds */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-tr from-cyan-300 to-blue-400 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-purple-300 to-pink-400 rounded-full blur-3xl opacity-20 animate-ping" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-8 md:p-12 space-y-6"
      >
        {/* Heading */}
        <motion.h2
          variants={item}
          className="text-3xl font-extrabold text-center text-gray-800"
        >
          Biz bilan bog‘laning
        </motion.h2>

        <motion.p variants={item} className="text-center text-gray-500 mb-6">
          Taklif, savol yoki fikrlaringiz bormi? Quyidagi formani to‘ldiring va biz tez orada siz bilan bog‘lanamiz.
        </motion.p>

        {/* Success Message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-emerald-600 font-medium mt-4 bg-green-100 p-4 rounded-lg shadow"
            >
              Xabaringiz yuborildi! Tez orada siz bilan bog‘lanamiz.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid layout */}
        <div className="grid md:grid-cols-2 gap-10 mt-8">
          {/* Contact Info */}
          <motion.div
            variants={item}
            className="space-y-6 text-gray-700 text-base"
          >
            <div>
              <p className="font-semibold text-lg text-blue-700 mb-1">📞 Telefon</p>
              <p>+998 90 123 45 67</p>
            </div>
            <div>
              <p className="font-semibold text-lg text-blue-700 mb-1">📧 Email</p>
              <p>support@elib.uz</p>
            </div>
            <div>
              <p className="font-semibold text-lg text-blue-700 mb-1">📍 Manzil</p>
              <p>Urgut tumani, Samarqand viloyati, O'zbekiston</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={item}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-gray-700 mb-1">Ismingiz</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ismingizni kiriting"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Sarlavha</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Xabar mavzusi"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Xabar</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Xabaringizni bu yerga yozing..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition transform duration-300"
              >
                Yuborish
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
