import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

// --- 1. AUTH LOGIC ---
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) return { user: null, loading: true, isAuthenticated: false, login: () => {}, logout: () => {} };
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try { setUser(JSON.parse(userData)); } catch (e) { console.error('Auth Error:', e); }
    }
    setLoading(false);
  }, []);

  const login = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const value = { user, login, logout, loading, isAuthenticated: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 2. IMPORTS ---
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import FinancialServicesPage from './pages/FinancialServicesPage';
import TrainingPage from './pages/TrainingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';
import OrdersPage from './pages/OrdersPage';
import InfoHubPage from './pages/InfoHubPage';
import ProfilePage from './pages/ProfilePage';
import { Button } from './components/ui/button';
import { LayoutDashboard, ShoppingBag, Wallet, GraduationCap, Home as HomeIcon, Menu, X, User, LogOut } from 'lucide-react';

// --- 3. COMPONENTS ---
const NavItem = ({ to, icon: Icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
      <Icon size={16} />
      <span>{children}</span>
    </Link>
  );
};

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">FC</div>
              <span className="text-gray-900 font-bold hidden sm:block">FarmConnect</span>
            </Link>

            {/* Desktop Navigation - RESTORED & FIXED */}
            <nav className="hidden md:flex items-center gap-1 mx-4">
              <NavItem to="/" icon={HomeIcon}>Home</NavItem>
              <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
              <NavItem to="/marketplace" icon={ShoppingBag}>Marketplace</NavItem>
              <NavItem to="/financial-services" icon={Wallet}>Credit</NavItem>
              <NavItem to="/training" icon={GraduationCap}>Training</NavItem>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {user ? (
                <>
                  <Link to="/profile" className="hidden sm:flex">
                    <Button variant="ghost" className="rounded-full gap-2">
                      <User size={18} />
                      <span>{user.firstName}</span>
                    </Button>
                  </Link>
                  <Button onClick={logout} variant="ghost" size="icon" className="rounded-full">
                    <LogOut size={18} />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login"><Button variant="ghost" className="rounded-full">Sign In</Button></Link>
                  <Link to="/register"><Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">Get Started</Button></Link>
                </>
              )}
              
              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 ml-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <NavItem to="/" icon={HomeIcon} onClick={() => setMobileMenuOpen(false)}>Home</NavItem>
              <NavItem to="/dashboard" icon={LayoutDashboard} onClick={() => setMobileMenuOpen(false)}>Dashboard</NavItem>
              <NavItem to="/marketplace" icon={ShoppingBag} onClick={() => setMobileMenuOpen(false)}>Marketplace</NavItem>
              <NavItem to="/financial-services" icon={Wallet} onClick={() => setMobileMenuOpen(false)}>Credit</NavItem>
              <NavItem to="/training" icon={GraduationCap} onClick={() => setMobileMenuOpen(false)}>Training</NavItem>
              {user && (
                 <NavItem to="/profile" icon={User} onClick={() => setMobileMenuOpen(false)}>Profile</NavItem>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2025 FarmConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
            <Route path="/financial-services" element={<ProtectedRoute><FinancialServicesPage /></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute><TrainingPage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/info-hub" element={<ProtectedRoute><InfoHubPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
