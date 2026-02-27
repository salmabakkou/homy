import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiMaximize, FiHeart, FiMapPin } from 'react-icons/fi';
import { fetchHouses } from '../store/housesSlice';
import { fetchReservations } from '../store/reservationsSlice';
import HouseCard from '../components/HouseCard';

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
    dispatch(fetchReservations());
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

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative pt-8 md:pt-16 pb-20 md:pb-32 overflow-hidden">

        {/* Cercles de lumière décoratifs (Glow) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C3091C]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div className="hero-content space-y-8 z-20 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-gray-100 rounded-full shadow-sm mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C3091C] animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#C3091C]">L'Art de Vivre Impérial</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black leading-[1.1] text-gray-900">
              Louez l'Excellence <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="text-[#C3091C] italic">Séjours de Prestige</span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#D4AF37]/30 rounded-full" />
              </span>
            </h1>

            <p className="text-gray-500 text-base md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Une collection exclusive de villas et riads en <span className="text-gray-900 font-medium">location saisonnière</span> pour des moments inoubliables.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-6 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/maisons')}
                className="group flex items-center justify-center gap-4 bg-[#C3091C] text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(195,9,28,0.3)] hover:bg-black hover:shadow-none transition-all duration-500 transform active:scale-95"
              >
                Explorer
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-10 py-5 border-2 border-gray-900 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-900 hover:text-white transition-all duration-500 text-center active:scale-95"
              >
                Réservation
              </button>
            </div>
          </div>

          {/* Visual Layered Montage */}
          <div className="hero-image-vessel relative h-[450px] sm:h-[600px] w-full max-w-[550px] mx-auto lg:max-w-none">

            {/* Main Overlapping Image */}
            <div className="image-layer floating-1 absolute top-[5%] right-0 w-[75%] h-[80%] z-20">
              <div className="relative w-full h-full p-2 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">
                <img src={homy1} className="w-full h-full object-cover rounded-[2rem]" alt="Luxe 1" />
                <div className="absolute -top-4 -right-4 w-20 h-20 border-t-4 border-r-4 border-[#D4AF37]/40 rounded-tr-[3rem] -z-10" />
              </div>
            </div>

            {/* Secondary Overlapping Image */}
            <div className="image-layer floating-2 absolute bottom-0 left-0 w-[60%] h-[60%] z-30">
              <div className="relative w-full h-full p-2 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">
                <img src={homy2} className="w-full h-full object-cover rounded-[2rem]" alt="Luxe 2" />
              </div>
            </div>

            {/* Background Accent Image (Hidden on small mobile) */}
            <div className="image-layer floating-3 absolute top-[20%] left-[5%] w-[35%] h-[35%] z-10 hidden sm:block">
              <img src={homy4} className="w-full h-full object-cover rounded-[2rem] shadow-xl opacity-40 grayscale sepia hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-pointer" alt="Luxe 3" />
            </div>

          </div>
        </div>
      </section>

      {/* --- PROPERTY GRID --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-[#C3091C] font-bold uppercase tracking-[0.4em] text-[9px]">Dernières Opportunités</h2>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Nos Résidences de Prestige</h3>
            </div>
            <Link to="/maisons" className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-800 hover:text-[#C3091C] transition-colors">
              VOIR TOUTES LES MAISONS
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#C3091C] group-hover:bg-[#C3091C] group-hover:text-white transition-all duration-300">
                <FiArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C3091C] mb-4"></div>
              <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
                Chargement en cours...
              </div>
            </div>
          ) : !loading && houses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 w-full">
              <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
                Aucune propriété trouvée
              </div>
            </div>
          ) : (
            <div className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {houses.slice(0, 3).map(house => (
                <div key={house.id} className="property-card">
                  <HouseCard house={house} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CALL TO ACTION BAND --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative rounded-[3rem] bg-[#C3091C] p-12 md:p-24 overflow-hidden group">
            <img src={homy3} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:scale-110 transition-transform duration-1000" alt="" />
            <div className="relative z-10 text-center space-y-10">
              <h2 className="text-white text-3xl md:text-4xl font-serif font-bold max-w-3xl mx-auto leading-tight">
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


    </div>
  );
}
