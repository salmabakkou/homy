import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiMaximize, FiHeart, FiMapPin } from 'react-icons/fi';
import { fetchHouses } from '../store/housesSlice';

// Assets
import homy1 from '../assets/homy1.jpg';
import homy2 from '../assets/homy2.jpg';
import homy3 from '../assets/homy3.jpg';
import homy4 from '../assets/homy4.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: houses, loading } = useSelector((state) => state.houses);

  const heroRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
      })
      .from(".hero-image-vessel", {
        x: 60,
        opacity: 0,
        duration: 1.4,
      }, "-=1")
      .from(".image-layer", {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
      }, "-=1");

      // Advanced floating animation with rotation
      gsap.to(".floating-1", {
        y: -15,
        rotation: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(".floating-2", {
        y: 15,
        rotation: -2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(".floating-3", {
        x: 10,
        rotation: 1,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Scroll trigger for cards
      gsap.from(".property-card", {
        scrollTrigger: {
          trigger: ".property-grid",
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });

      // Subtle background parallax
      gsap.to(".bg-accent", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 100,
        ease: "none"
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#FDFCF9] overflow-x-hidden min-h-screen">
      
      {/* --- HERO SECTION --- (Width matching Navbar: max-w-7xl) */}
      <section ref={heroRef} className="relative pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          
          {/* Content */}
          <div className="hero-content space-y-8 z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#C3091C] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Collection Exclusive 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-black leading-tight text-gray-900">
              Trouvez Votre <br />
              <span className="text-[#C3091C] italic">Havre de Paix</span> <br />
              au Maroc
            </h1>
            
            <p className="text-gray-500 text-lg max-w-md leading-relaxed font-light">
              Une sélection rigoureuse de propriétés d'exception alliant héritage architectural et luxe contemporain.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                onClick={() => navigate('/maisons')}
                className="group flex items-center gap-4 bg-[#C3091C] text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-black transition-all duration-500"
              >
                Explorer
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="px-10 py-5 border border-gray-200 text-gray-800 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all font-sans"
              >
                Nous Contacter
              </button>
            </div>
          </div>

          {/* Visual Layered Montage */}
          <div className="hero-image-vessel relative h-[500px] md:h-[600px]">
            <div className="image-layer floating-1 absolute top-0 right-0 w-[60%] h-[70%] z-20">
              <img src={homy1} className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border-8 border-white" alt="Luxe 1" />
            </div>
            <div className="image-layer floating-2 absolute bottom-0 left-0 w-[55%] h-[60%] z-30">
              <img src={homy2} className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border-8 border-white" alt="Luxe 2" />
            </div>
            <div className="image-layer floating-3 absolute top-[15%] left-[5%] w-[40%] h-[40%] z-10 opacity-60 grayscale blur-[1px]">
              <img src={homy4} className="w-full h-full object-cover rounded-[2rem] shadow-xl" alt="Luxe 3" />
            </div>
            
            {/* Background decoration (not zoomed) */}
            <div className="bg-accent absolute -right-20 -top-20 w-80 h-80 bg-[#C3091C]/5 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* --- PROPERTY GRID --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 space-y-4">
            <h2 className="text-[#C3091C] font-bold uppercase tracking-[0.4em] text-[9px]">Dernières Opportunités</h2>
            <h3 className="text-4xl font-serif font-bold text-gray-900">Nos Résidences de Prestige</h3>
          </div>

          <div className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(n => <div key={n} className="h-96 rounded-3xl bg-gray-50 animate-pulse" />)
            ) : (
              houses.slice(0, 3).map(house => (
                <div 
                  key={house.id}
                  onClick={() => navigate(`/maisons/${house.id}`)}
                  className="property-card group cursor-pointer space-y-6"
                >
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    <img src={house.mainImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                    <div className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-[#C3091C] transition-colors">
                      <FiHeart size={18} />
                    </div>
                  </div>
                  <div className="px-2 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       <FiMapPin className="text-[#C3091C]" /> {house.city}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#C3091C] transition-colors font-serif">{house.title}</h4>
                    <p className="text-[#C3091C] font-black text-lg">{house.price} <span className="text-[10px] text-gray-400 font-bold tracking-tighter ml-1">MAD</span></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION BAND --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative rounded-[3rem] bg-[#C3091C] p-12 md:p-24 overflow-hidden group">
            <img src={homy3} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:scale-110 transition-transform duration-1000" alt="" />
            <div className="relative z-10 text-center space-y-10">
              <h2 className="text-white text-4xl md:text-6xl font-serif font-bold max-w-3xl mx-auto leading-tight">
                Prêt à Découvrir la Maison de Vos <span className="italic font-normal">Rêves ?</span>
              </h2>
              <button 
                onClick={() => navigate('/contact')}
                className="px-12 py-5 bg-white text-[#C3091C] rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-2xl"
              >
                Prendre rendez-vous
              </button>
            </div>
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* --- MINI FOOTER --- */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400">
          <span>Homy Luxury Realty</span>
          <span>© 2026 Tous droits réservés</span>
        </div>
      </footer>

    </div>
  );
}
