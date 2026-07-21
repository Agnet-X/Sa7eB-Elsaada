import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'هل اللحوم المتاحة لدى جزارة صاحب السعادة بلدي وجاموسي طازجة؟',
      a: 'نعم 100%! جميع لحومنا ذبح اليوم صباحاً من أنقى المواشي البلدية والجاموسي والبقري الكندوز بالجيزة، ولا نبيع أي لحوم مجمدة أو مستوردة نهائياً.'
    },
    {
      q: 'هل تبيعون الدواجن أو الطيور؟',
      a: 'لا، نحن نركز تخصصنا كاملاً وبأعلى درجات الاحترافية في اللحوم البلدي والجاموسي والكندوز والمصنعات البلدي (كبدة، مومبار، كوارع، عكاوي، مفروم، برجر، كفتة). ولا نبيع الدواجن نهائياً لضمان النظافة والجودة.'
    },
    {
      q: 'كيف أستطيع اختيار طريقة التقطيع ونسبة الدهن والتغليف؟',
      a: 'عند الضغط على أي منتج، يمكنك تحديد الوزن بدقة (حتى 250 جرام)، واختيار طريقة التقطيع (مكعبات، شرائح، ستيك، شاورما، مفروم)، ونسبة الدهن، وطريقة التغليف (تفريغ هواء Vacuum أو أطباق أو كيس ثلج).'
    },
    {
      q: 'ما هي طرق الدفع المتاحة؟ وهل يمكن الطلب عبر الواتساب؟',
      a: 'الدفع نقداً عند الاستلام فقط (Cash on Delivery)، بدون الحاجة لأي كروت بنكية أو دفع إلكتروني داخل الموقع. بمجرد تأكيد طلبك، يتم تجهيز الرسالة تلقائياً وإرسالها لمحادثة الواتساب الخاصة بنا (01124795553).'
    },
    {
      q: 'ما هي مناطق وسرعة التوصيل بالجيزة؟',
      a: 'نوصل فوراً لمناطق مزلقان مني الأمير، الحوامدية، البدرشين، الجيزة وضواحيها في أسرع وقت داخل أكياس عازلة حافظة للبرودة.'
    }
  ];

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-red-950/60 px-3 py-1 rounded-full border border-amber-500/30">
          أسئلة شائعة
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold gold-gradient-text mt-2">
          كل ما تود معرفته قبل الطلب 💡
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-neutral-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-right flex items-center justify-between font-bold text-sm sm:text-base text-slate-100 hover:text-amber-300 transition-colors"
              >
                <span className="flex items-center space-x-2 space-x-reverse">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium border-t border-neutral-800/60 bg-neutral-900/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
