export default function Verse() {
  return (
    <section
      className="py-24 text-center px-6 relative"
      style={{
        background: 'linear-gradient(135deg, #1a3a4a 0%, #0e2430 100%)',
      }}
    >
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-3xl opacity-15 select-none" aria-hidden="true">🙏</div>
      <div className="max-w-2xl mx-auto">
        <blockquote>
          <p className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] text-cream italic leading-relaxed mb-5">
            &laquo;Dios es nuestro amparo y nuestra fortaleza,<br />
            nuestra ayuda segura en momentos de angustia.&raquo;
          </p>
          <cite className="text-gold font-medium not-italic tracking-wide">&mdash; Salmos 46:1</cite>
        </blockquote>
      </div>
    </section>
  );
}
