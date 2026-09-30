
import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { Home } from './pages/Home';
import { Scan } from './pages/Scan';
import { Study } from './pages/Study';
import { Paywall } from './pages/Paywall';
import { Library } from './pages/Library';
import { Quiz } from './pages/Quiz';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/study' || location.pathname === '/paywall' || location.pathname === '/quiz';

  return (
    <div className="app-container">
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/study" element={<Study />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/library" element={<Library />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarding_complete')
  );

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
