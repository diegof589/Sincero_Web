import { useCallback, useState } from "react";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import IntroAnimation from "./components/IntroAnimation";
import { LanguageProvider } from "./components/LanguageProvider";
import Navbar from "./components/Navbar";
import Pain from "./components/Pain";
import { ThemeProvider } from "./components/ThemeProvider";
import SocialProof from "./components/SocialProof";
import Solution from "./components/Solution";

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const completeIntro = useCallback(() => setIntroDone(true), []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        {!introDone && <IntroAnimation onComplete={completeIntro} />}
        <Navbar />
        <main>
          <Hero />
          <Pain />
          <Solution />
          <CTA />
          <SocialProof />
        </main>
        <Footer />
      </LanguageProvider>
    </ThemeProvider>
  );
}
