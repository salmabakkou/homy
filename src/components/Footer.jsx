import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 md:py-12 border-t border-gray-100 bg-[#FDFCF9]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-400 text-center md:text-left">
        <span>Homy Luxury Realty</span>
        <span>© {currentYear} Tous droits réservés</span>
      </div>
    </footer>
  );
}
