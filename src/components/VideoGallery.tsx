import React, { useState } from 'react';
import { Play, X, Film } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BUTCHER_SHOWCASE_VIDEOS as FALLBACK_SHOWCASE_VIDEOS } from '../data/videos';
import { ButcherVideo } from '../types';

export const VideoGallery: React.FC = () => {
  const { galleryVideos } = useApp();
  const activeGalleryVideos = galleryVideos && galleryVideos.length > 0 ? galleryVideos : FALLBACK_SHOWCASE_VIDEOS;
  const [activeVideo, setActiveVideo] = useState<ButcherVideo | null>(null);

  return (
    <section id="videos-section" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 space-x-reverse text-[#e63946] text-[10px] font-extrabold uppercase tracking-widest bg-red-950/60 px-3.5 py-1 rounded-full border border-red-800/40 mb-2">
          <Film className="w-4 h-4 text-[#e63946]" />
          <span>جودة العمل والشفافية التامة</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          شاهد التقطيع، النظافة، والتغليف بـ عينك 🎬
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-2">
          نحن في جزارة صاحب السعادة نضمن لك أعلى مستويات التعقيم والتجهيز الفاخر أمام كاميراتنا يومياً.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeGalleryVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="bg-[#16161a] border border-white/10 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#e63946]/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl"
          >
            <div className="relative h-56 overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#e63946] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-4 right-4 bg-black/80 text-amber-300 font-mono text-xs px-3 py-1 rounded-full font-bold border border-white/10">
                {video.duration}
              </span>
              <span className="absolute top-4 right-4 bg-[#e63946] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {video.category}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-white group-hover:text-[#e63946] transition-colors mb-1">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/80 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-4 bg-neutral-950 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-amber-300">{activeVideo.title}</h3>
              <p className="text-xs text-slate-400">{activeVideo.description}</p>
            </div>

            <div className="aspect-video w-full bg-black">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
