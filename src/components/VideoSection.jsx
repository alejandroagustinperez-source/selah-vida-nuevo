export default function VideoSection() {
  const videos = [
    {
      title: 'No te duermas sin escuchar esto — Salmos 4:8',
      category: 'Oración',
      duration: '0:22',
      thumbnail: 'https://i.ytimg.com/vi/h8HOLeAPVjc/maxresdefault.jpg',
      url: 'https://www.youtube.com/shorts/h8HOLeAPVjc',
    },
    {
      title: '¿Por qué Dios permite el sufrimiento? Romanos 5:3-5',
      category: 'Fe & propósito',
      duration: '0:25',
      thumbnail: 'https://i.ytimg.com/vi/lgxAcgGD_48/maxresdefault.jpg',
      url: 'https://www.youtube.com/shorts/lgxAcgGD_48',
    },
    {
      title: 'Si Dios lo sabe todo… ¿por qué permitió que Adán y Eva pecaran?',
      category: 'Palabra',
      duration: '0:33',
      thumbnail: 'https://i.ytimg.com/vi/qN3LsA813jw/maxresdefault.jpg',
      url: 'https://www.youtube.com/shorts/qN3LsA813jw',
    },
  ];

  return (
    <section id="videos" className="py-6 md:py-10 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>V</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Reflexiones en video
          </h2>
          <p className="font-serif text-sm italic mt-2" style={{ color: '#5A6A5A' }}>
            Devocionales breves para tu día
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 my-4 md:my-6 px-6">
          <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
          <span className="text-base md:text-lg select-none" style={{ color: '#C9922A' }}>◆</span>
          <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {videos.map((v, i) => (
            <div key={i} className="flex flex-col rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(201,146,42,0.2)' }}>
              {/* Thumbnail */}
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full aspect-[9/16] overflow-hidden"
                style={{ backgroundColor: '#0F3D3D', backgroundImage: `url("${v.thumbnail}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <span
                  className="absolute top-2 left-2 text-[10px] tracking-[0.1em] font-bold uppercase px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                >
                  SHORT
                </span>
                <span
                  className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#FAF7F2' }}
                >
                  {v.duration}
                </span>
              </a>
              {/* Card body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="text-[10px] tracking-[0.15em] font-semibold uppercase" style={{ color: '#C9922A' }}>
                  {v.category}
                </span>
                <h3 className="font-serif text-sm font-bold leading-snug" style={{ color: '#0F3D3D' }}>
                  {v.title}
                </h3>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold mt-auto inline-flex items-center gap-1 hover:underline"
                  style={{ color: '#C9922A' }}
                >
                  Ver en YouTube →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.youtube.com/playlist?list=PL4nvVcLI5n7jHbrRqkswHUciUViWTD4-W"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-[#C9922A] text-[#0F3D3D] px-8 py-3 rounded-full text-xs tracking-[0.15em] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all"
          >
            VER TODOS LOS VIDEOS
          </a>
        </div>
      </div>
    </section>
  );
}
