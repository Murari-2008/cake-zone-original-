import React, { useState } from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook, Share2, Compass, CheckCircle, MessageSquare, X } from 'lucide-react';
import { StoreSettings } from '../types';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

interface ContactSectionProps {
  settings: StoreSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [selectedRoute, setSelectedRoute] = useState<'station' | 'busstand' | 'colony'>('colony');
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Left Columns details details */}
      <div className="lg:col-span-5 bg-amber-950 text-amber-50 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-900 rounded-full blur-3xl opacity-30" />
        
        <div className="space-y-4">
          <span className="text-amber-200/80 text-[10px] uppercase font-mono tracking-widest font-bold">Location & Hours</span>
          <h3 id="contact-details-heading" className="text-2xl md:text-3xl font-serif font-black tracking-tight leading-tight">
            Cake Zone Kadapa HQ
          </h3>
          <p className="text-amber-100/60 text-xs">
            Stop by for a warm cup of coffee and standard fresh cool cakes baked by original artisanal designers.
          </p>
        </div>

        {/* Indicators */}
        <div className="space-y-4.5 pt-4 border-t border-amber-900/60 text-xs">
          <div className="flex gap-3.5 items-start">
            <div className="bg-amber-900 p-2 rounded-xl text-amber-100 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase opacity-75">Our Address</p>
              <h4 className="font-serif text-sm font-bold mt-0.5">{settings.address}</h4>
              <p className="text-[10px] opacity-75 text-amber-200">Kadapa, Andhra Pradesh, India</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Cake+Zone,+Co-operative+Colony,+Kadapa,+Andhra+Pradesh,+India"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1 text-[10px] text-amber-200 hover:text-white underline mt-1.5 transition-colors"
              >
                <Compass className="w-3 h-3" /> View on Google Maps
              </a>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="bg-amber-900 p-2 rounded-xl text-amber-100 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase opacity-75">Hotline Contact</p>
              <h4 className="font-mono text-sm font-bold mt-0.5">
                {settings.contactPhone.split(',').map((phone, idx, arr) => {
                  const trimmed = phone.trim();
                  return (
                    <React.Fragment key={trimmed}>
                      <a 
                        href={`tel:${trimmed}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedPhone(trimmed);
                        }}
                        className="hover:underline text-amber-200 hover:text-white transition-colors duration-150 cursor-pointer"
                      >
                        {trimmed}
                      </a>
                      {idx < arr.length - 1 && <span className="text-amber-400/50 font-sans mx-1.5">|</span>}
                    </React.Fragment>
                  );
                })}
              </h4>
              <p className="text-[10px] opacity-75 text-amber-200">Call to request custom tier fondant themes</p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="bg-amber-900 p-2 rounded-xl text-amber-100 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase opacity-75">Operational Hours</p>
              <h4 className="font-serif text-xs font-bold mt-1">Mon - Fri: {settings.openingHours.weekdays}</h4>
              <h4 className="font-serif text-xs font-bold mt-0.5">Sat - Sun: {settings.openingHours.weekends}</h4>
            </div>
          </div>
        </div>

        {/* Social sharing anchors */}
        <div className="pt-6 border-t border-amber-900/60 flex items-center justify-between">
          <span className="text-[11px] opacity-75">Social Profiles:</span>
          <div className="flex gap-3">
            <a 
              href="https://www.instagram.com/cake_zone_kadapa/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-amber-900/50 hover:bg-amber-900 p-2.5 rounded-full text-amber-100 transition-colors shadow-sm"
              title="Cake Zone on Instagram"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a 
              href="https://www.facebook.com/cakezonekadapa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-amber-900/50 hover:bg-amber-900 p-2.5 rounded-full text-amber-100 transition-colors shadow-sm"
              title="Cake Zone on Facebook"
            >
              <Facebook className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Right Column: Custom Vector Interactive Map & directions */}
      <div className="lg:col-span-7 bg-white border border-stone-100 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
        
        {/* Interactive map view display */}
        <div className="relative bg-stone-50 border border-stone-200/50 h-64 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center">
          {hasValidKey ? (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
              <Map
                defaultCenter={{lat: 14.4764, lng: 78.8255}}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{width: '100%', height: '100%'}}
              >
                <AdvancedMarker position={{lat: 14.4764, lng: 78.8255}} title="Cake Zone Kadapa">
                  <Pin background="#78350f" glyphColor="#fef3c7" borderColor="#78350f" />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          ) : (
            <>
              {/* Simple Vector Grid Art representing Kadapa Street Overlay */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #78350f 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              {/* Mock Street Roads */}
              <div className="absolute top-1/3 left-0 right-0 h-4 bg-stone-200/60 blur-[0.5px] rotate-2 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-2/3 w-4 bg-stone-200/60 blur-[0.5px] -rotate-6 pointer-events-none" />
              <div className="absolute bottom-1/4 left-0 right-0 h-4 bg-stone-200/60 blur-[0.5px] -rotate-1 pointer-events-none" />

              {/* Central shop marker node */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-amber-900 rounded-full border-2 border-white flex items-center justify-center text-yellow-100 shadow-md animate-pulse">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="bg-white/95 border border-amber-200 shadow-lg p-2.5 rounded-xl font-serif text-xs font-black text-amber-950 mt-2">
                  Cake Zone 🍰 <span className="text-[10px] text-stone-500 font-sans font-normal block mt-0.5">co-operative Colony, Kadapa</span>
                </div>
              </div>

              {/* Informative overlay regarding real maps activation */}
              <div className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center p-4 text-center z-20">
                <h4 className="text-amber-100 font-serif font-bold text-sm mb-1">
                  Live Google Maps
                </h4>
                <p className="text-[10px] text-amber-50/70 max-w-sm mb-3">
                  Expose live navigation, real-time satellite imagery, and active location pins by setting your Google Maps API key in AI Studio Secrets.
                </p>
                <div className="flex gap-2">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Cake+Zone,+Co-operative+Colony,+Kadapa,+Andhra+Pradesh,+India"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="bg-amber-700 hover:bg-amber-600 text-amber-50 font-medium text-[10px] py-1.5 px-3 rounded-lg shadow transition-colors flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" /> Open Direct Google Map
                  </a>
                  <button
                    onClick={() => {
                      alert("To activate live maps:\n1. Click the Gear Icon (⚙️) on top-right.\n2. Go to Secrets.\n3. Add a secret named GOOGLE_MAPS_PLATFORM_KEY.\n4. Input your Google Maps API key and press Enter.");
                    }}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 font-medium text-[10px] py-1.5 px-3 rounded-lg transition-colors"
                  >
                    Setup Key Info
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Direction indicators */}
          {selectedRoute === 'station' && !hasValidKey && (
            <div className="absolute bottom-4 left-4 bg-amber-900 text-amber-100 border border-amber-800 text-[10px] p-2 rounded-xl text-left font-mono max-w-[210px] z-30 animate-fade-in shadow-md">
              🚦 <strong>Route from Rly Station:</strong> Take Station Rd, turn left near Old Bus Stand, head straight 1.5km to co-operative Colony park. Shop sits opposite State Bank.
            </div>
          )}

          {selectedRoute === 'busstand' && !hasValidKey && (
            <div className="absolute bottom-4 left-4 bg-amber-900 text-amber-100 border border-amber-800 text-[10px] p-2 rounded-xl text-left font-mono max-w-[210px] z-30 animate-fade-in shadow-md">
              🏍️ <strong>Route from Bus Stand:</strong> Head South on Trunk Road, take bypass road crossover towards co-operative Colony gate, drive 500m.
            </div>
          )}

          {selectedRoute === 'colony' && !hasValidKey && (
            <div className="absolute bottom-4 right-4 bg-white/90 text-stone-700 border border-stone-200 text-[9px] p-1 px-2.5 rounded font-mono shadow-sm z-30">
              📍 Click routings below to navigate Kadapa
            </div>
          )}
        </div>

        {/* Direction controllers */}
        <div className="space-y-3">
          <h4 className="font-serif text-stone-900 font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-800" /> Interactive Route Navigation Estimator
          </h4>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setSelectedRoute('station')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedRoute === 'station'
                  ? 'border-amber-900 bg-amber-900 text-white font-medium'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
              }`}
            >
              From Rail Station
            </button>
            <button
              onClick={() => setSelectedRoute('busstand')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedRoute === 'busstand'
                  ? 'border-amber-900 bg-amber-900 text-white font-medium'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
              }`}
            >
              From Bus Stand
            </button>
            <button
              onClick={() => setSelectedRoute('colony')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedRoute === 'colony'
                  ? 'border-amber-900 bg-amber-900 text-white font-medium'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
              }`}
            >
              Co-operative Colony
            </button>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedPhone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhone(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full z-10 overflow-hidden"
            >
              {/* Decorative amber glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-950/40 rounded-full blur-2xl opacity-50 -mr-4 -mt-4 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-amber-700 dark:text-amber-400 text-[10px] uppercase font-mono tracking-wider font-bold">Contact Channel</span>
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-50 mt-0.5">Connect with Us</h3>
                </div>
                <button 
                  onClick={() => setSelectedPhone(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                How would you like to reach out to us at <strong className="text-amber-900 dark:text-amber-300 font-mono">{selectedPhone}</strong>?
              </p>
              
              <div className="space-y-3">
                {/* 1. Call Hotline */}
                <a
                  href={`tel:${selectedPhone}`}
                  onClick={() => setSelectedPhone(null)}
                  className="flex items-center gap-3 w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs py-3.5 px-4 rounded-2xl transition-all shadow hover:shadow-md active:scale-[0.98] justify-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>1. Call Hotline</span>
                </a>
                
                {/* 2. WhatsApp Chat */}
                <a
                  href={`https://wa.me/91${selectedPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedPhone(null)}
                  className="flex items-center gap-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-4 rounded-2xl transition-all shadow hover:shadow-md active:scale-[0.98] justify-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>2. WhatsApp Chat</span>
                </a>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setSelectedPhone(null)}
                  className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:underline transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
