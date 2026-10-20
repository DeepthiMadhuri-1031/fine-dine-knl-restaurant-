import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, ArrowLeft, UtensilsCrossed, AlertTriangle, Scale, Clock } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
              <FileCheck className="w-4 h-4" />
              <span>Dining & Service Agreement</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
              Terms & Conditions
            </h1>
            <p className="text-xs text-cream-400 mt-2">
              FINE DINE KNL RESTAURANT · 18, Khadakpura Street, Kurnool, Andhra Pradesh 518001
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm text-cream-200 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-gold-400" />
                <span>1. 100% Pure Vegetarian Kitchen Commitment</span>
              </h2>
              <p>
                FINE DINE KNL is an authentic, dedicated pure vegetarian culinary establishment. All dishes, ingredients, oils, and cookware are maintained according to strict pure-veg food preparation standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>2. Order Processing & Food Preparation</span>
              </h2>
              <p>
                To preserve traditional royal flavors, our biryanis, starters, and curries are freshly prepared upon receipt of an order. Standard kitchen preparation time ranges from 15 to 30 minutes depending on order volume.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-gold-400" />
                <span>3. Pricing & Order Calculation</span>
              </h2>
              <p>
                All menu item prices displayed on the website are authoritatively computed and re-verified on our backend server at checkout:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-cream-300">
                <li>A standard packaging fee of ₹15 is applied to safeguard temperature and hygiene during transit.</li>
                <li>Delivery within Kurnool city limits is ₹30, waived automatically on orders valued at ₹500 or higher.</li>
                <li>Minimum order values may be applied dynamically by restaurant management during peak hours.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gold-400" />
                <span>4. Customer Conduct & Accuracy</span>
              </h2>
              <p>
                Customers must provide accurate contact numbers and delivery instructions. Repeated non-acceptance of Cash on Delivery (COD) dispatches may result in account restriction.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};
export default TermsPage;
