
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Scan } from './pages/Scan';
import { Study } from './pages/Study';
import { Paywall } from './pages/Paywall';
import { Library } from './pages/Library';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/study' || location.pathname === '/paywall';

  return (
    <div className="app-container">
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/study" element={<Study />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
