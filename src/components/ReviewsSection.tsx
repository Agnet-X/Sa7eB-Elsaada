import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, Quote, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    addReview({
      author,
      rating,
      location: location || 'الجيزة',
      comment,
      verified: true
    });

    setAuthor('');
    setLocation('');
    setComment('');
    setShowAddModal(false);
  };

  return (
    <section id="reviews-section" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-red-900/40">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-red-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            ثقة أهالي الجيزة
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold gold-gradient-text mt-1">
            ماذا يقول عملاؤنا عن جزارة صاحب السعادة؟ ⭐️
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-800 to-amber-600 hover:from-red-700 text-white font-bold text-xs shadow-lg red-glow flex items-center space-x-1.5 space-x-reverse"
        >
          <MessageSquarePlus className="w-4 h-4 ml-1.5" />
          <span>أضف تقييمك ورأيك</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="glass-card p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between relative hover:border-amber-500/40 transition-all"
          >
            <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 left-4 pointer-events-none" />

            <div>
              <div className="flex items-center space-x-1 space-x-reverse text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
              <div>
                <span className="font-bold text-white block">{rev.author}</span>
                <span className="text-slate-500">{rev.location}</span>
              </div>
              <span className="text-emerald-400 font-medium flex items-center">
                <CheckCircle className="w-3 h-3 ml-1" />
                عميل موثق
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121218] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-neutral-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold gold-gradient-text mb-4">أضف تجربتك وتقييمك</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-300 mb-1">الاسم الكريم:</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: محمد أحمد"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">المنطقة (مثلاً: مزلقان مني الأمير):</label>
                <input
                  type="text"
                  placeholder="الجيزة"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">التقييم:</label>
                <div className="flex space-x-2 space-x-reverse text-amber-400 text-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`hover:scale-125 transition-transform ${
                        star <= rating ? 'fill-current' : 'text-slate-700'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">رأيك وتجربتك مع جزارتنا:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="اكتب تجربتك مع جودة اللحم، التقطيع والتوصيل..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-800 to-amber-600 text-white font-extrabold text-sm shadow-lg red-glow"
              >
                إرسال التقييم
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
