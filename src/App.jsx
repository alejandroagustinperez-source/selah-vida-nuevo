import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

function HomePage() {
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
