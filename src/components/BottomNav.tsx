import { NavLink } from 'react-router-dom';
import { Home, Camera, Library } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => cn("nav-item", isActive && "active")}
        end
      >
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      
      <NavLink 
        to="/scan" 
        className={({ isActive }) => cn("nav-item scan-btn", isActive && "active")}
      >
        <div className="scan-btn-icon">
          <Camera size={26} color="white" />
        </div>
        <span style={{ marginTop: '4px' }}>Scan</span>
      </NavLink>
      
      <NavLink 
        to="/library" 
        className={({ isActive }) => cn("nav-item", isActive && "active")}
      >
        <Library size={24} />
        <span>Library</span>
      </NavLink>
    </nav>
  );
}
