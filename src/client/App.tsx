import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import AboutPage from './pages/AboutPage';
import RecommendedPage from './pages/RecommendedPage';
import PrivacyPage from './pages/PrivacyPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentPage from './pages/AssessmentPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/global.css';

interface AppProps {
  ssrData?: Record<string, unknown>;
}

export function App({ ssrData = {} }: AppProps) {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage ssrData={ssrData} />} />
        <Route path="/articles" element={<ArticlesPage ssrData={ssrData} />} />
        <Route path="/articles/:slug" element={<ArticlePage ssrData={ssrData} />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/assessments/:slug" element={<AssessmentPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/recommended" element={<RecommendedPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
