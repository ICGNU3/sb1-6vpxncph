import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DemoDataProvider } from './components/DemoDataProvider';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Explore = lazy(() => import('./pages/Explore'));
const Create = lazy(() => import('./pages/Create'));
const Resources = lazy(() => import('./pages/Resources'));
const Community = lazy(() => import('./pages/Community'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const Goals = lazy(() => import('./pages/Goals'));
const Launch = lazy(() => import('./pages/Launch'));
const InvestorDeck = lazy(() => import('./pages/InvestorDeck'));
const Alpha = lazy(() => import('./pages/Alpha'));
const Admin = lazy(() => import('./pages/Admin'));

export function App() {
  const { setUser, setSession, setLoading } = useAuthStore();

  React.useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <DemoDataProvider>
        <ErrorBoundary>
          <Layout>
            <Suspense fallback={<LoadingScreen />}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/launch" element={<Launch />} />
                  <Route path="/investor" element={<InvestorDeck />} />
                  <Route path="/alpha" element={<Alpha />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </Suspense>
          </Layout>
        </ErrorBoundary>
      </DemoDataProvider>
    </BrowserRouter>
  );
}

export default App;