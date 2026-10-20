import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, Eye, Database, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
              <ShieldCheck className="w-4 h-4" />
              <span>Customer Data Protection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
              Privacy Policy
            </h1>
            <p className="text-xs text-cream-400 mt-2">
              Last Updated: October 2026 · FINE DINE KNL RESTAURANT, Kurnool
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm text-cream-200 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold-400" />
                <span>1. Information We Collect</span>
              </h2>
              <p>
                When you visit, register, or order from <strong>FINE DINE KNL RESTAURANT</strong>, we collect necessary personal details to process your dining orders and facilitate food delivery in Kurnool. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-cream-300">
                <li><strong>Identity Information:</strong> Your full name and email address.</li>
                <li><strong>Contact Information:</strong> 10-digit Indian mobile number for delivery communication and order updates.</li>
                <li><strong>Delivery Addresses:</strong> Street, house number, landmark, city (Kurnool), and pin code.</li>
                <li><strong>Order History:</strong> Ordered dishes, customizations, notes, and payment status records.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gold-400" />
                <span>2. Security & Password Protection</span>
              </h2>
              <p>
                Security is foundational to our architecture:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-cream-300">
                <li>All user passwords are cryptographically hashed using <strong>scrypt</strong> with random per-user salts. Plaintext passwords are never stored or logged.</li>
                <li>API endpoints are protected via signed JSON Web Tokens (JWT) with strict expiration timeouts.</li>
                <li>We do not store credit or debit card numbers on our servers. Online UPI transactions are verified directly via banking reference IDs.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-gold-400" />
                <span>3. How We Use Your Data</span>
              </h2>
              <p>
                Your information is used strictly for legitimate restaurant operations:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-cream-300">
                <li>Dispatching freshly prepared royal meals to your location in Kurnool.</li>
                <li>Sending transactional order confirmations and kitchen preparation tracking.</li>
                <li>Managing single-use secure password recovery tokens.</li>
                <li>Internal quality checks and restaurant management insights.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-400" />
                <span>4. Contact Our Operations Team</span>
              </h2>
              <p>
                If you have questions regarding your personal information, saved delivery addresses, or want your customer account removed from our database, please contact our Kurnool management team at <strong>support@finedineknl.com</strong> or call <strong>+91 98765 43210</strong>.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};
export default PrivacyPolicyPage;
