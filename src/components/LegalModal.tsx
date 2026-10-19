import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, FileText, X, Mail, Phone, MapPin, CheckCircle, ExternalLink } from 'lucide-react';
import CakeZoneLogo from './CakeZoneLogo';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative bg-white dark:bg-stone-900 border border-amber-900/20 dark:border-amber-700/30 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col z-10 overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-900/40 shrink-0">
            <div className="flex items-center gap-3">
              <CakeZoneLogo size={36} />
              <div>
                <h2 className="font-serif font-black text-lg tracking-wide uppercase">
                  Cake Zone Kadapa
                </h2>
                <p className="text-[11px] text-amber-200/80 font-mono">
                  Official Legal Information & Compliance
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 px-6 pt-3 shrink-0 gap-3">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'privacy'
                  ? 'border-amber-600 text-amber-800 dark:text-amber-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'terms'
                  ? 'border-amber-600 text-amber-800 dark:text-amber-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Terms of Service
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
            {activeTab === 'privacy' ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-amber-100 mb-1">
                    Privacy Policy
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-mono">
                    Last Updated: June 2026 | Effective Date: June 2026
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-stone-800 dark:text-stone-200">
                  <p className="font-medium">
                    At <strong>Cake Zone Kadapa</strong> (located opposite State Bank, Co-operative Colony, Kadapa), we respect your privacy. This policy outlines how we collect, use, and protect your information when you visit our website, place custom cake orders, or sign in using Google Authentication.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    1. Information We Collect
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <strong>Google Sign-In & Account Details:</strong> When you sign in with Google, we access standard profile information provided via Google OAuth (your Name, Email address, and Profile Avatar) to create your user account and remember your orders.
                    </li>
                    <li>
                      <strong>Order & Delivery Information:</strong> When you place or customize an order, we collect delivery recipient details, contact telephone number, delivery address in Kadapa, and cake customization specifications (eggless preferences, flavor choice, custom piping text).
                    </li>
                    <li>
                      <strong>Customer Feedback & Reviews:</strong> Ratings and feedback you choose to submit for our bakery items.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    2. How We Use Your Information
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>To prepare, bake, pack, and coordinate delivery or pickup of your cake orders.</li>
                    <li>To credit loyalty reward points and track your past orders.</li>
                    <li>To send order confirmation and dispatch notifications via Email or WhatsApp.</li>
                    <li>To verify authorized owner and administrative dashboard access.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    3. Data Security & Third-Party Sharing
                  </h4>
                  <p>
                    We <strong>never sell, lease, or distribute</strong> your personal information or contact details to third-party advertisers. All authentication credentials are securely managed by Google Firebase Authentication infrastructure.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    4. Cookies & Local Storage
                  </h4>
                  <p>
                    We use browser local storage solely to retain your current shopping cart contents, custom cake design preferences, and session state across page refreshes.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    5. Your Data Rights & Deletion Requests
                  </h4>
                  <p>
                    You may at any time request the deletion of your account profile or order records by contacting us at <strong>parthakesarla@gmail.com</strong> or by phone at <strong>+91 7396500338</strong>. We will process your request promptly.
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    6. Contacting Cake Zone
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>parthakesarla@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>+91 7396500338 / +91 9014384008</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Opposite State Bank, Co-operative Colony, Kadapa, Andhra Pradesh, India</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-amber-100 mb-1">
                    Terms of Service
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-mono">
                    Last Updated: June 2026 | Effective Date: June 2026
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-stone-800 dark:text-stone-200">
                  <p className="font-medium">
                    Welcome to <strong>Cake Zone Kadapa</strong>. By accessing our platform, placing orders, or using our custom cake design studio, you agree to comply with and be bound by the following terms and conditions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    1. Ordering & Custom Bakery Works
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>All fresh cream and fondant custom theme cakes are handcrafted to order based on the specifications provided by the customer.</li>
                    <li>Color nuances and decorative elements may vary slightly due to hand-piping craftsmanship and artistic rendering.</li>
                    <li>Please inspect your baked goods upon pickup or delivery. Any concerns regarding freshness or items must be reported within 2 hours of receipt.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    2. Pricing & Payments
                  </h4>
                  <p>
                    All prices are listed in Indian Rupees (INR) and are subject to availability. Pre-orders placed online can be settled in-store upon collection, via UPI on delivery, or through confirmed phone confirmation.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    3. Cancellations & Modifications
                  </h4>
                  <p>
                    Standard menu orders may be cancelled up to 3 hours prior to scheduled preparation. Multi-tier custom celebration theme cakes require at least 12 hours advance notice for cancellation or tier resizing.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    4. Loyalty Points Program
                  </h4>
                  <p>
                    Loyalty points earned from purchases have no independent cash value and may only be redeemed toward eligible bakery items at Cake Zone Kadapa.
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                  <h4 className="font-bold text-stone-900 dark:text-amber-200 text-sm mb-2">
                    5. Store Location & Inquiries
                  </h4>
                  <p className="text-xs">
                    Cake Zone Kadapa, Opposite State Bank, Co-operative Colony, Kadapa. Hotline: <strong>7396500338</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-stone-500 font-mono">
              &copy; {new Date().getFullYear()} Cake Zone. All rights reserved.
            </span>
            <button
              onClick={onClose}
              className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
