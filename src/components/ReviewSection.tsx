import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Quote, ShoppingBag, ThumbsUp } from 'lucide-react';
import { Review } from '../types';

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export default function ReviewSection({ reviews, onAddReview }: ReviewSectionProps) {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hasVoted, setHasVoted] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      setErrorMsg('Kindly enter your name and some sweet thoughts.');
      return;
    }
    setErrorMsg('');

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    };

    onAddReview(newReview);
    setUserName('');
    setRating(5);
    setComment('');
    setSuccessMsg('Thank you! Your verified review has been posted in real-time.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleHelpful = (id: string) => {
    if (hasVoted.includes(id)) return;
    setHasVoted([...hasVoted, id]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <span className="text-amber-700 text-xs font-mono uppercase tracking-widest font-bold">Patron Voices</span>
        <h2 id="reviews-heading" className="text-3xl md:text-4xl font-serif text-amber-950 font-bold tracking-tight">
          Community Trust & Testimonials
        </h2>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          Read raw honest feedback or leave your own rating on our specialized Kadapa bakes.
        </p>
      </div>

      {/* Average score visual cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Cumulative score card */}
        <div className="md:col-span-4 bg-amber-950 text-amber-50 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Quote className="w-48 h-48 rotate-180" />
          </div>
          <p className="text-amber-200/80 font-mono text-xs uppercase tracking-widest font-bold mb-2">Overall Rating</p>
          <h3 className="text-6xl font-serif font-black">{averageRating.toFixed(1)}</h3>
          
          <div className="flex gap-1.5 mt-3 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-amber-800'
                }`}
              />
            ))}
          </div>

          <p className="text-amber-200/60 text-xs mt-3">
            Based on {reviews.length} verified order records from Kadapa.
          </p>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-8 flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {reviews.map((r) => {
              const voted = hasVoted.includes(r.id);
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-stone-100 rounded-2xl p-5 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif font-bold text-stone-900 text-sm">{r.userName}</h4>
                        <span className="text-[10px] text-stone-400 block font-mono">{r.date}</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < r.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-700 text-sm mt-3.5 leading-relaxed font-sans italic">
                      "{r.comment}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-50">
                    <span className="text-[10px] bg-amber-50 text-amber-900 font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3 text-amber-700" /> Co-operative Colony customer
                    </span>
                    <button
                      type="button"
                      onClick={() => handleHelpful(r.id)}
                      className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                        voted 
                          ? 'bg-emerald-50 text-emerald-800 font-medium'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-500'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{voted ? 'Helpful (1)' : 'Helpful'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-amber-50/40 border border-amber-100/50 rounded-3xl p-6 md:p-8">
        <h3 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2">
          <MessageSquare className="w-4.5 h-4.5 text-amber-700" /> Share Your Sweet Experience
        </h3>
        <p className="text-stone-500 text-xs mt-1">
          Have you purchased cupcakes, biscuits, or cool cakes from Cake Zone? Leave your rating!
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest font-mono mb-1.5">
                Your Noble Name
              </label>
              <input
                type="text"
                placeholder="e.g., Haritha Devi"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest font-mono mb-1.5">
                Star Rating
              </label>
              <div className="flex gap-2 bg-white border border-stone-200 p-2.5 rounded-xl">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setRating(stars)}
                    className="transition-transform active:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        stars <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-auto text-xs text-stone-500 font-mono self-center pr-1.5 font-bold">
                  {rating}/5 Stars
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest font-mono mb-1.5">
                Your Review Text
              </label>
              <textarea
                rows={4}
                maxLength={400}
                placeholder="Describe the sponginess, fresh cream frosting texture, or the crunch of our Bombay salt biscuits..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="h-4">
                {errorMsg && <p className="text-red-600 text-xs font-medium">{errorMsg}</p>}
                {successMsg && <p className="text-emerald-700 text-xs font-bold">{successMsg}</p>}
              </div>

              <button
                type="submit"
                className="bg-amber-900 hover:bg-amber-950 text-white font-medium text-xs py-2.5 px-5 rounded-xl tracking-wider uppercase shadow-sm hover:shadow active:scale-95 transition-all ml-auto"
              >
                Publish Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}
