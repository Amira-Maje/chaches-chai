import React from 'react';
import { PageType } from '../types';
import { ASSET_IMAGES } from '../data/mockData';
import { 
  Heart, 
  Coffee, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Users, 
  Clock, 
  Award,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#24150f] text-white border border-[#422c21] p-8 sm:p-12 lg:p-16">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53] flex items-center gap-1.5 mb-2">
            <Heart className="w-4 h-4 fill-current text-[#e89f53]" />
            <span>Our Journey & Roots</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            An Ode to the Timeless Soul of Indian Chai
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#d5c3b7] leading-relaxed">
            In a fast-paced world of drive-thrus and automated paper cup machines, Chachees&apos; was born to protect the sacred ritual of slow-brewed tea, earthen clay kulhads, and heartfelt community baithaks.
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 hidden md:block">
          <img
            src={ASSET_IMAGES.cuttingChai}
            alt="Artisanal Chai Tapri"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24150f] to-transparent" />
        </div>
      </div>

      {/* The Origin Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-[#4b3c33] leading-relaxed">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
            How It Began
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d1b13]">
            From Mumbai College Tapris to Sanctuary Cafes
          </h2>
          <p>
            Chai in India has never been just a beverage. It is an emotional anchor. It is the spontaneous conversation between strangers sheltered from a monsoon downpour under a plastic tarp. It is the 4 PM ritual that saves weary corporate workers. It is the unhurried gossip shared on wooden benches over Bun Maska.
          </p>
          <p>
            However, we noticed a painful dilemma: you either had authentic roadside tapris where you couldn’t sit for hours, or sterile western coffee chains where chai was an afterthought made from synthetic powders and sugary syrups.
          </p>
          <p className="font-semibold text-[#8e3a1d]">
            Chachees&apos; was created to bridge this divide. We combine the fiery authenticity of the street chai wallah with the comfort, aesthetic warmth, and hospitality of a luxurious neighborhood living room.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#ebdcd0] bg-[#fbf4eb] h-80 sm:h-96">
          <img
            src={ASSET_IMAGES.cafeInterior}
            alt="Chachees Baithak Heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-[#ebdcd0] text-xs">
            <p className="font-bold text-[#2d1b13]">Traditional Baithak Seating</p>
            <p className="text-[11px] text-[#7d6558] mt-0.5">
              Hand-carved wooden tables, low floor bolsters, and brass lanterns in every cafe.
            </p>
          </div>
        </div>
      </section>

      {/* Ethical Sourcing & Potters Guild */}
      <section className="bg-[#fbf4eb] rounded-3xl p-8 sm:p-12 border border-[#e6d3c2]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
            Single-Origin & Sustainable
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d1b13] mt-1">
            Rooted in Soil and Respect
          </h2>
          <p className="text-xs text-[#6f5647] mt-1">
            Every ingredient is traceable directly to the farmers and artisans who cultivate it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#ebdcd0] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#fdf3ec] text-[#8e3a1d] flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#2d1b13] mb-1">
              Organic Assam CTC Leaves
            </h3>
            <p className="text-xs text-[#6f5647] leading-relaxed">
              Sourced from independent tea gardens in Golaghat, Assam. Picked at peak harvest to deliver rich maltiness that stands up to slow boiling without turning bitter.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#ebdcd0] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#fdf3ec] text-[#8e3a1d] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#2d1b13] mb-1">
              Kerala Spice Highlands
            </h3>
            <p className="text-xs text-[#6f5647] leading-relaxed">
              We source green cardamom directly from smallholder farms in Idukki, cinnamon bark from Ceylon groves, and fiery ginger root freshly delivered daily.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#ebdcd0] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#fdf3ec] text-[#8e3a1d] flex items-center justify-center mb-4">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#2d1b13] mb-1">
              The Potter&apos;s Collective
            </h3>
            <p className="text-xs text-[#6f5647] leading-relaxed">
              Over 120 traditional potter families in Rajasthan and Uttar Pradesh handcraft our natural clay kulhads. Zero glaze, 100% compostable, returned to the earth.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 Tenets Banner */}
      <section className="bg-[#24150f] rounded-3xl p-8 sm:p-12 text-white border border-[#422c21]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#e89f53]">100%</div>
            <p className="text-xs text-[#d5c3b7] mt-1">Whole Real Spices (Never Powders)</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#e89f53]">0%</div>
            <p className="text-xs text-[#d5c3b7] mt-1">Single-Use Plastics in Chai Serving</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#e89f53]">120+</div>
            <p className="text-xs text-[#d5c3b7] mt-1">Artisan Potter Families Supported</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#e89f53]">14</div>
            <p className="text-xs text-[#d5c3b7] mt-1">Community Baithak Outlets</p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="text-center space-y-4 max-w-md mx-auto">
        <h3 className="font-serif font-bold text-2xl text-[#2d1b13]">
          Taste the Artisanal Difference
        </h3>
        <p className="text-xs text-[#6f5647]">
          Visit any of our 14 cafes or order freshly brewed kulhad chai directly to your doorstep.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('menu')}
            className="bg-[#8e3a1d] hover:bg-[#a64523] text-white font-bold px-6 py-3 rounded-2xl text-xs transition-colors shadow-sm"
          >
            Explore Menu
          </button>
          <button
            onClick={() => onNavigate('book-table')}
            className="bg-[#24150f] hover:bg-black text-white font-bold px-6 py-3 rounded-2xl text-xs transition-colors"
          >
            Reserve Table
          </button>
        </div>
      </div>
    </div>
  );
};
