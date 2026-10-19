export default function Verse() {
  return (
    <section className="bg-sv-teal text-sv-cream py-24 md:py-32 px-6">
      <figure className="max-w-[900px] mx-auto flex flex-col items-center gap-6 text-center">
        <blockquote
          className="font-display italic font-medium leading-snug text-sv-cream"
          style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)' }}
        >
          Dios es nuestro amparo y nuestra fortaleza, nuestra ayuda segura en momentos de angustia.
        </blockquote>
        <figcaption className="text-[17px] text-sv-gold-light">Salmo 46:1</figcaption>
      </figure>
    </section>
  );
}
