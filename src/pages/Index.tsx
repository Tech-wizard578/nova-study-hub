import { Helmet } from 'react-helmet-async';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AIDemoSection from '@/components/AIDemoSection';
import LeaderboardSection from '@/components/LeaderboardSection';
import StudyMaterialsSection from '@/components/StudyMaterialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>StudyVerse - AI-Powered Study Platform for College Students</title>
        <meta 
          name="description" 
          content="Transform your learning with StudyVerse. AI-powered summaries, study materials, question banks, and a vibrant community. Join 50K+ students excelling today." 
        />
        <meta name="keywords" content="study platform, AI learning, college students, study materials, question banks, AI summarizer" />
        <meta property="og:title" content="StudyVerse - Your AI-Powered Study Universe" />
        <meta property="og:description" content="Transform the way you learn with intelligent summaries, personalized quizzes, and a vibrant community of learners." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://studyverse.app" />
      </Helmet>

      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        <ParticleBackground />
        <Navbar />
        
        <main>
          <HeroSection />
          <FeaturesSection />
          <AIDemoSection />
          <LeaderboardSection />
          <StudyMaterialsSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
