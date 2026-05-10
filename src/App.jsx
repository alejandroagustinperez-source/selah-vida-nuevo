import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Features from './components/Features';
import Verse from './components/Verse';
import Pricing from './components/Pricing';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import RevealOnScroll from './components/RevealOnScroll';

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />

      <RevealOnScroll><Problem /></RevealOnScroll>
      <RevealOnScroll><Solution /></RevealOnScroll>
      <RevealOnScroll><Features /></RevealOnScroll>
      <RevealOnScroll><Verse /></RevealOnScroll>
      <RevealOnScroll><Pricing /></RevealOnScroll>
      <RevealOnScroll><FinalCta /></RevealOnScroll>

      <Footer />
    </>
  );
}
