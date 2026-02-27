import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-gray-100 bg-[#FDFCF9]">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400">
        <span>Homy Luxury Realty</span>
        <span>© {currentYear} Tous droits réservés</span>
      </div>
    </footer>
  );
}
