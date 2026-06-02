export default function Divider({ thin }) {
  if (thin) {
    return <div className="h-px w-full" style={{ backgroundColor: 'rgba(201,146,42,0.3)' }} />;
  }
  return (
    <div className="flex items-center justify-center gap-3 my-10 md:my-14 px-6">
      <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
      <span className="text-base md:text-lg select-none" style={{ color: '#C9922A' }}>◆</span>
      <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
    </div>
  );
}
