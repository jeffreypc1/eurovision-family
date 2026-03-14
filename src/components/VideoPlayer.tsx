'use client';

interface VideoPlayerProps {
  videoId: string;
  songTitle: string;
  country: string;
  onClose: () => void;
}

export default function VideoPlayer({ videoId, songTitle, country, onClose }: VideoPlayerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">{songTitle}</h2>
            <p className="text-white/60 text-sm">{country}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>

        {/* Video iframe */}
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <p className="text-center text-white/30 text-sm mt-3">
          Press Escape or click ✕ to close
        </p>
      </div>
    </div>
  );
}
