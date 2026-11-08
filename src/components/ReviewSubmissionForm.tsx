import React, { useState } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, MessageSquare, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiUrl } from '../config/api';
import { Button3D } from './Button3D';

interface ReviewSubmissionFormProps {
  onReviewSubmitted?: (newReview: any) => void;
}

export const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({ onReviewSubmitted }) => {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [dishExperienced, setDishExperienced] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your name (at least 2 characters).');
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMessage('Please write your dining review comment (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          rating,
          dishExperienced: dishExperienced.trim() || undefined,
          comment: comment.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#D7A64A', '#4A1020', '#FFF7E9']
        });
      } catch {}

      setSuccessMessage('Thank you! Your dining review has been submitted and published.');
      if (onReviewSubmitted && data.review) {
        onReviewSubmitted(data.review);
      }

      // Reset form
      setCustomerName('');
      setDishExperienced('');
      setComment('');
      setRating(5);
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-charcoal-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Share Your Dining Experience</span>
      </div>
      
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 mb-1">
        Leave a Review for Ajwa Exotica
      </h3>
      <p className="text-xs text-cream-300 font-light mb-6">
        Your honest feedback helps us maintain culinary excellence for Kurnool food lovers.
      </p>

      {successMessage ? (
        <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="font-serif text-lg font-bold text-cream-100">{successMessage}</h4>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-xs text-gold-400 underline hover:text-gold-300 font-semibold"
          >
            Submit Another Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
              Your Rating:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-gold-400 hover:scale-110 transition-transform focus:outline-none"
                  aria-label={`${star} Stars`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-gold-500 text-gold-500'
                        : 'text-charcoal-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-gold-400 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="space-y-1">
              <label htmlFor="customerNameReview" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Your Name <span className="text-gold-400">*</span>
              </label>
              <input
                id="customerNameReview"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Anand Varma"
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 placeholder-cream-400 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
              />
            </div>

            {/* Dish Experienced */}
            <div className="space-y-1">
              <label htmlFor="dishExperienced" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Dishes Ordered (Optional)
              </label>
              <input
                id="dishExperienced"
                type="text"
                value={dishExperienced}
                onChange={(e) => setDishExperienced(e.target.value)}
                placeholder="e.g. Mutton Mandi & Butter Chicken"
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 placeholder-cream-400 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
              />
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label htmlFor="reviewComment" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
              Review & Feedback <span className="text-gold-400">*</span>
            </label>
            <textarea
              id="reviewComment"
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you enjoyed about the flavours, ambience, terrace seating, or service..."
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 placeholder-cream-400 text-xs focus:outline-none focus:border-gold-500/60 transition-colors resize-none"
            />
          </div>

          <Button3D
            variant="gold"
            size="md"
            type="submit"
            isLoading={isSubmitting}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Post Dining Review
          </Button3D>
        </form>
      )}
    </div>
  );
};
