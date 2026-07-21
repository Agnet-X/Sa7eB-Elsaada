import React from 'react';
import { ShieldCheck, Award, Flame, PackageCheck, Truck, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <Flame className="w-8 h-8 text-amber-400" />,
      title: 'ذبح يومي طازج 100%',
      desc: 'لحوم بلدية وجاموسي طازجة ذبح الصباح مباشرة بدون تخزين مجمد.'
    },
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      title: 'تخصص بلدي وجاموسي فقط',
      desc: 'لا نتعامل في الدواجن لضمان أقصى درجات التركيز والجودة العالية.'
    },
    {
      icon: <PackageCheck className="w-8 h-8 text-amber-400" />,
      title: 'تفريغ هواء Vacuum',
      desc: 'تغليف آلي مفرغ من الهواء للحفاظ على نضارة وطعم اللحم الطازج.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      title: 'تقطيع وإعداد حسب الطلب',
      desc: 'اختر طريقة التتقطيع (طاجن، بوفتيك، شاورما، مفروم، كفتة) ونسب الدهن.'
    },
    {
      icon: <Truck className="w-8 h-8 text-amber-400" />,
      title: 'توصيل سريع للجيزة وضواحيها',
      desc: 'شحن في أكياس حافظة للثلج لضمان وصول الطلب بارداً وطازجاً.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-400" />,
      title: 'نظافة وتعقيم مستمر',
      desc: 'أعلى معايير الشفافية والنظافة لسلامة أسرتك وصحتهم.'
    }
  ];

  return (
    <section className="py-16 px-4 border-y border-white/10 my-12 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e63946] bg-red-950/60 px-3.5 py-1 rounded-full border border-red-800/40">
            لماذا تختارنا؟
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
            سر تميز جزارة صاحب السعادة 🥩
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[2.5rem] bg-[#16161a] border border-white/10 hover:border-[#e63946]/50 transition-all hover:-translate-y-1 group shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="p-3.5 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/30 w-fit mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e63946] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
