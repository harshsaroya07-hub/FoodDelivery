import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, X, Send, Award, Check } from 'lucide-react';
import { Order } from '../types';

export const ReviewsModal: React.FC<{
  orderToReview: Order | null;
  onClose: () => void;
}> = ({ orderToReview, onClose }) => {
  const { showToast } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>(['Hot & Fresh', 'Super Fast', 'Eco Packaging']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderToReview) return null;

  const availableTags = [
    'Hot & Fresh',
    'Super Fast',
    'Eco Packaging',
    'Great Taste',
    'Hygiene Sealed',
    'Polite Driver'
  ];

  const toggleTag = (t: string) => {
    setTags(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: orderToReview.restaurantId,
          userName: 'Harsh Vardhan',
          rating,
          comment,
          tags
        })
      });
      setIsSubmitting(false);
      showToast('🎉 Review Submitted! +50 Foodora Points Added!');
      onClose();
    } catch (err) {
      console.error('Review submit error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl tracking-tight">Rate Your Experience ⭐</h2>
            <p className="text-xs text-amber-100">{orderToReview.restaurantName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-slate-800 dark:text-slate-100">
          
          {/* Star Selector */}
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              How was your food?
            </span>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tag Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Quick Feedback Badges:
            </span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(t => {
                const isSelected = tags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition border ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Box */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Write a Review:
            </span>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell others what you loved about the food, taste, or packaging!"
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Rewards Callout */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center space-x-2 text-xs text-amber-900 dark:text-amber-300">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Earn <strong>50 Foodora Points</strong> instantly upon submitting!</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded-2xl shadow transition text-xs flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Review</span>
          </button>
        </div>

      </div>
    </div>
  );
};
