import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FeaturesPage from './pages/FeaturesPage';
import BlogPage from './pages/BlogPage';
import GuidesPage from './pages/GuidesPage';
import TipsPage from './pages/TipsPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SecurityPage from './pages/SecurityPage';
import PlanTripPage from './pages/PlanTripPage';
import ExperiencesPage from './pages/ExperiencesPage';
import CreatePostPage from './pages/CreatePostPage';
import AIPlannerPage from './pages/AIPlannerPage';
import CreateTripPage from './pages/CreateTripPage';
import ItineraryPage from './pages/ItineraryPage';
import GeneratedItinerary from './components/GeneratedItinerary';
import ProfilePage from './pages/ProfilePage';

// Home page components
import { Hero } from './components/Hero';
import { Wonders } from './components/Wonders';
import { Features } from './components/Features';
import { UsaDestinations } from './components/UsaDestinations';
import { TravelBlogs } from './components/TravelBlogs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Wonders />
              <Features />
              <UsaDestinations />
              <TravelBlogs />
            </>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/plan-trip" element={<PlanTripPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/GeneratedItinerary" element={<GeneratedItinerary />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/ai-planner" element={<AIPlannerPage />} />
          <Route path="/create-trip" element={<CreateTripPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;