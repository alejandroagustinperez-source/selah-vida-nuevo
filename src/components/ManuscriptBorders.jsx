export default function ManuscriptBorders({ children }) {
  return (
    <>
      {/* Left ornamental panel */}
      <div
        className="hidden xl:block fixed top-0 bottom-0 left-0 pointer-events-none z-10 opacity-90"
        style={{
          width: '72px',
          background: "url('/border-ornament.png') repeat-y center top",
          backgroundSize: '72px auto',
        }}
      />
      {/* Right ornamental panel (mirrored) */}
      <div
        className="hidden xl:block fixed top-0 bottom-0 right-0 pointer-events-none z-10 opacity-90"
        style={{
          width: '72px',
          background: "url('/border-ornament.png') repeat-y center top",
          backgroundSize: '72px auto',
          transform: 'scaleX(-1)',
        }}
      />
      {children}
    </>
  );
}
