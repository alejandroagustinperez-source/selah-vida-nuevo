export default function ManuscriptBorders({ children }) {
  return (
    <>
      {/* Left double border — hidden below xl */}
      <div className="hidden xl:block fixed top-0 left-0 h-screen pointer-events-none z-10">
        <div style={{ position: 'absolute', top: 0, left: '12px', width: '1px', height: '100%', backgroundColor: '#C9922A' }} />
        <div style={{ position: 'absolute', top: 0, left: '17px', width: '3px', height: '100%', backgroundColor: '#0F3D3D' }} />
      </div>
      {/* Right double border — hidden below xl */}
      <div className="hidden xl:block fixed top-0 right-0 h-screen pointer-events-none z-10">
        <div style={{ position: 'absolute', top: 0, right: '17px', width: '3px', height: '100%', backgroundColor: '#0F3D3D' }} />
        <div style={{ position: 'absolute', top: 0, right: '12px', width: '1px', height: '100%', backgroundColor: '#C9922A' }} />
      </div>
      {children}
    </>
  );
}
