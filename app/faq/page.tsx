'use client';

import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-400">Everything you need to know about shopping on QuickKart</p>
        </div>

        <div className="mb-16 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-xl backdrop-blur-3xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Still have questions?</h2>
          <p className="text-slate-300 mb-6">
            If you need help, our support team is ready to assist you.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-6 text-center">
              <div className="text-3xl mb-3">📧</div>
              <p className="font-semibold text-white mb-2">Email Support</p>
              <p className="text-sm text-slate-400">support@quickkart.mw</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <p className="font-semibold text-white mb-2">WhatsApp</p>
              <p className="text-sm text-slate-400">Available on request</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-6 text-center">
              <div className="text-3xl mb-3">📞</div>
              <p className="font-semibold text-white mb-2">Phone Support</p>
              <p className="text-sm text-slate-400">Available during business hours</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🛒</span>
              General
            </h2>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">1. What is QuickKart?</h3>
                <p className="text-slate-300">QuickKart is an online marketplace that allows you to shop from multiple stores in one place. You can compare prices, choose your preferred shop, and place orders easily.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">2. How does QuickKart work?</h3>
                <p className="text-slate-300">You browse products, select a shop offering the best price or availability, add items to your cart, and place your order. Each shop fulfills and delivers its part of the order.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">3. Can I buy from different shops in one order?</h3>
                <p className="text-slate-300">Yes. You can add products from multiple shops to your cart. However, orders may be processed and delivered separately depending on the shops selected.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">💸</span>
              Pricing & Payments
            </h2>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">4. Why do prices differ between shops?</h3>
                <p className="text-slate-300">Each shop sets its own prices, promotions, and stock levels. This allows you to compare and choose the best deal.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">5. Do I have to pay online?</h3>
                <p className="text-slate-300 mb-3">No. You can choose to:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                  <li>Pay online</li>
                  <li>Pay on delivery (cash)</li>
                  <li>Pay via mobile money outside the app</li>
                  <li>Pay on pickup</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">6. How does "Pay on Delivery" work?</h3>
                <p className="text-slate-300">You place your order without paying upfront. When your order is delivered, you pay the delivery agent in cash or as agreed.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">7. How do I pay via mobile money?</h3>
                <p className="text-slate-300">After placing your order, you will receive payment instructions (number and reference). Once you send the payment, your order will be confirmed.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🚚</span>
              Delivery
            </h2>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">8. How long does delivery take?</h3>
                <p className="text-slate-300">Delivery time depends on the shop you order from. Some shops offer same-day delivery, while others may take longer.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">9. Why am I charged multiple delivery fees?</h3>
                <p className="text-slate-300">If you order from multiple shops, each shop may deliver separately, which can result in separate delivery charges.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">10. Can I track my order?</h3>
                <p className="text-slate-300">Yes. You can track the status of your order from your account dashboard.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📦</span>
              Orders & Issues
            </h2>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">11. Can I cancel my order?</h3>
                <p className="text-slate-300">Yes, but only before the order is processed or dispatched. Once it's out for delivery, cancellation may not be possible.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">12. What if an item is out of stock?</h3>
                <p className="text-slate-300">If a product becomes unavailable after you place an order, the shop will notify you and may offer a replacement or refund.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">13. What happens if I'm not available during delivery?</h3>
                <p className="text-slate-300">The delivery agent may attempt redelivery or contact you to reschedule. Additional charges may apply.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🏪</span>
              Shops & Quality
            </h2>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">14. Are all shops verified?</h3>
                <p className="text-slate-300">Yes. All shops on QuickKart are reviewed before being allowed to sell on the platform.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">15. Who do I contact if there's a problem with my order?</h3>
                <p className="text-slate-300">You can contact our support team directly via email at support@quickkart.mw.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🔐</span>
              Account & Security
            </h2>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">16. Do I need an account to place an order?</h3>
                <p className="text-slate-300">Yes. Creating an account allows you to track orders, manage deliveries, and receive updates.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">17. Is my information secure?</h3>
                <p className="text-slate-300">Yes. We use secure systems to protect your personal and payment information.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
