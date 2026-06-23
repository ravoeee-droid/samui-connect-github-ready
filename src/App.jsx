import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import GameOverlay from '@/components/gamification/GameOverlay';
import ServiceWorkerCleaner from '@/components/ServiceWorkerCleaner';
import { LanguageProvider } from '@/lib/i18n';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// App pages
import Landing from '@/pages/Landing';
import LegalPage from '@/pages/LegalPage';
import Contact from '@/pages/Contact';
import ProviderDashboard from '@/pages/ProviderDashboard';
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import RoomChat from '@/pages/RoomChat';
import Explore from '@/pages/Explore';
import Messages from '@/pages/Messages';
import DMChat from '@/pages/DMChat';
import Work from '@/pages/Work';
import Rentals from '@/pages/Rentals';
import Events from '@/pages/Events';
import NewWorkPost from '@/pages/NewWorkPost';
import NewEvent from '@/pages/NewEvent';
import Profile from '@/pages/Profile';

// Layout
import AppLayout from '@/components/layout/AppLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/welcome" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/app/onboarding" element={<Onboarding />} />
        <Route path="/room/:roomId" element={<RoomChat />} />
        <Route path="/app/room/:roomId" element={<RoomChat />} />
        <Route path="/dm/:threadId" element={<DMChat />} />
        <Route path="/app/dm/:threadId" element={<DMChat />} />
        <Route path="/events/new" element={<NewEvent />} />
        <Route path="/app/events/new" element={<NewEvent />} />
        <Route path="/work/new" element={<NewWorkPost />} />
        <Route path="/app/work/new" element={<NewWorkPost />} />
        
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Home />} />
          <Route path="/app/explore" element={<Explore />} />
          <Route path="/app/messages" element={<Messages />} />
          <Route path="/app/rentals" element={<Rentals />} />
          <Route path="/app/events" element={<Events />} />
          <Route path="/app/work" element={<Work />} />
          <Route path="/app/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/legal/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/legal/terms" element={<LegalPage type="terms" />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/provider" element={<ProviderDashboard />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <GameOverlay />
        <ServiceWorkerCleaner />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App