import { NavLink } from 'react-router-dom';
import { Home, Camera, Library, Trophy } from 'lucide-react';
import { cn } from '../utils/cn';

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => cn("nav-item", isActive && "active")}
        end
      >
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink 
        to="/arena" 
        className={({ isActive }) => cn("nav-item", isActive && "active")}
      >
        <Trophy size={22} />
        <span>Arena</span>
      </NavLink>
      
      <NavLink 
        to="/scan" 
        className={({ isActive }) => cn("nav-item scan-btn", isActive && "active")}
      >
        <div className="scan-btn-icon">
          <Camera size={24} color="white" />
        </div>
        <span style={{ marginTop: '2px' }}>Scan</span>
      </NavLink>
      
      <NavLink 
        to="/library" 
        className={({ isActive }) => cn("nav-item", isActive && "active")}
      >
        <Library size={22} />
        <span>Library</span>
      </NavLink>
    </nav>
  );
}
