import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ArrowLeft, Clock, AlertCircle, CheckCircle2, PhoneCall } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
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
              <RotateCcw className="w-4 h-4" />
              <span>Customer Satisfaction & Refunds</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xs text-cream-400 mt-2">
              Transparent, fair customer rules for FINE DINE KNL RESTAURANT
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm text-cream-200 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>1. Customer Order Cancellation Window</span>
              </h2>
              <p>
                Because all royal dishes are prepared fresh to order, cancellations can only be made while the order status is <strong>"Confirmed"</strong> and before the kitchen advances it to <strong>"Preparing"</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-cream-300">
                <li>You can self-cancel eligible orders directly from your <Link to="/account" className="text-gold-400 underline">Account Dashboard</Link> or <Link to="/my-orders" className="text-gold-400 underline">My Orders</Link> screen.</li>
                <li>Once the kitchen status changes to <em>Preparing</em>, cancellations cannot be accepted as ingredients have already been deployed.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gold-400" />
                <span>2. Refund Processing</span>
              </h2>
              <p>
                In the event of an approved cancellation or verified service issue (such as an undeliverable order or missing item):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-cream-300">
                <li><strong>UPI Direct Payments:</strong> Refunds are initiated within 2 business hours back to the source bank account or VPA.</li>
                <li><strong>Cash on Delivery (COD):</strong> No charges are incurred if the order is cancelled before dispatch.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gold-400" />
                <span>3. Quality Discrepancies & Issues</span>
              </h2>
              <p>
                If your order arrives damaged, incorrect, or missing an item, please notify restaurant operations within <strong>30 minutes</strong> of delivery. Our management team will promptly dispatch a replacement or issue a full credit.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-gold-400" />
                <span>4. Direct Support Line</span>
              </h2>
              <p>
                For immediate assistance with an ongoing order, call our restaurant directly at <strong>+91 98765 43210</strong> or email <strong>support@finedineknl.com</strong>.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};
export default RefundPolicyPage;
