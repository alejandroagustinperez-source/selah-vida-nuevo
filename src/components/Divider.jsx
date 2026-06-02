export default function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-10 md:my-14 px-6">
      <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: '#C9922A' }} />
      <span className="text-base md:text-lg select-none" style={{ color: '#C9922A' }}>◆</span>
      <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: '#C9922A' }} />
    </div>
  );
}
