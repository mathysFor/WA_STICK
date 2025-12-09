"use client";

import { useState } from 'react';
import Image from 'next/image';
import HeaderImage from '../../assets/footer_shop.jpg';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Validation côté client
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          orderNumber: formData.orderNumber || null,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Erreur lors de l\'envoi' });
      } else {
        setStatus({ type: 'success', message: 'Votre message a bien été envoyé !' });
        setFormData({ name: '', email: '', orderNumber: '', message: '' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Erreur de connexion. Réessayez plus tard.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full">
      {/* HERO / BANNER IMAGE */}
      <section className="w-full">
        <Image
          src={HeaderImage}
          alt="Skiers on a snowy ridge"
          className="w-full h-56 md:h-80 object-cover object-[center_30%]"
        />
      </section>

      {/* TITLE + FORM */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <h1 className="text-center text-3xl md:text-4xl font-semibold tracking-tight mb-8 md:mb-10">
          Contactez-nous
        </h1>

        {status.message && (
          <div className={`mb-6 p-4 rounded-md text-center ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom & prénom *"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email *"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <input
            type="text"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            placeholder="Numéro de commande (optionnel)"
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Commentaire *"
            rows={6}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center bg-[#E645AC] rounded-md px-6 py-3 text-sm font-medium text-white tracking-wide hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
