import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
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
import Music from './pages/Music';
import Games from './pages/Games';
import Prayer from './pages/Prayer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AuthCallback from './pages/AuthCallback';

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

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
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
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/chat" element={<ProtectedLayout><Chat /></ProtectedLayout>} />
          <Route path="/music" element={<ProtectedLayout><Music /></ProtectedLayout>} />
          <Route path="/games" element={<ProtectedLayout><Games /></ProtectedLayout>} />
          <Route path="/prayer" element={<ProtectedLayout><Prayer /></ProtectedLayout>} />
          <Route path="/privacy" element={<><Navbar /><Privacy /></>} />
          <Route path="/terms" element={<><Navbar /><Terms /></>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
