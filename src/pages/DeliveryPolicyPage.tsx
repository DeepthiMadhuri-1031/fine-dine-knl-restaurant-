import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowLeft, Clock, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';

export const DeliveryPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cream-300 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="border-b border-charcoal-750 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Truck className="w-4 h-4" />
              <span>Doorstep Delivery Guidelines</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
              Delivery Policy
            </h1>
            <p className="text-xs text-cream-400 mt-2">
              Fast, hygienic food dispatch across Kurnool municipal coverage areas
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm text-cream-200 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-400" />
                <span>1. Serviceable Areas</span>
              </h2>
              <p>
                We deliver to residential and commercial locations throughout <strong>Kurnool City, Andhra Pradesh (PIN 518001, 518002, 518003, 518004)</strong> including Khadak Pura, Raj Vihar, Bellary Chowrasta, C-Camp, B-Camp, and adjacent sectors.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>2. Delivery Timelines</span>
              </h2>
              <p>
                Estimated delivery duration is typically <strong>30 to 45 minutes</strong> from the moment the kitchen confirms your order. Factors such as peak dining hours, inclement weather, and local traffic may marginally impact timelines. You can follow your order's real-time progress on our live visual tracker.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-gold-400" />
                <span>3. Delivery Fees & Free Delivery Threshold</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-cream-300">
                <li>Orders under ₹500 carry a nominal delivery charge of <strong>₹30</strong>.</li>
                <li>Orders of <strong>₹500 or more enjoy FREE Home Delivery</strong>.</li>
                <li>Takeaway / Counter pickup orders carry zero delivery fees.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <span>4. Safe & Tamper-Evident Packaging</span>
              </h2>
              <p>
                All biryanis and curries are packed in food-grade, leak-proof, high-grade microwaveable containers sealed securely to retain steam, aroma, and royal taste during transit.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};
export default DeliveryPolicyPage;
