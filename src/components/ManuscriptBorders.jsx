const ORNAMENT_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
       <line x1="40" y1="0" x2="40" y2="80" stroke="#C9922A" stroke-width="0.5"/>
       <path d="M 40 34 L 46 40 L 40 46 L 34 40 Z" fill="#C9922A"/>
     </svg>`
  );

export default function ManuscriptBorders({ children }) {
  return (
    <div className="flex justify-center xl:bg-[#F5EDD8]" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Left ornamental panel — hidden below xl */}
      <div
        className="hidden xl:block flex-1 relative overflow-hidden"
        style={{
          borderRight: '1px solid #E8DFC8',
          backgroundImage: `url("${ORNAMENT_SVG}")`,
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center',
          backgroundSize: '80px 80px',
        }}
      >
        <div className="absolute top-8 left-1/2 -translate-x-1/2" style={{ color: '#C9922A', fontSize: 20 }}>◆</div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ color: '#C9922A', fontSize: 20 }}>◆</div>
      </div>

      {/* Main content column */}
      <div className="w-full max-w-[900px]" style={{ backgroundColor: '#FAF7F2' }}>
        {children}
      </div>

      {/* Right ornamental panel — hidden below xl */}
      <div
        className="hidden xl:block flex-1 relative overflow-hidden"
        style={{
          borderLeft: '1px solid #E8DFC8',
          backgroundImage: `url("${ORNAMENT_SVG}")`,
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center',
          backgroundSize: '80px 80px',
        }}
      >
        <div className="absolute top-8 left-1/2 -translate-x-1/2" style={{ color: '#C9922A', fontSize: 20 }}>◆</div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ color: '#C9922A', fontSize: 20 }}>◆</div>
      </div>
    </div>
  );
}
