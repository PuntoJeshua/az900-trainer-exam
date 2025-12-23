import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Practice } from './pages/Practice';
import { Simulation } from './pages/Simulation';

import { Profile } from './pages/Profile';
import { Flashcards } from './pages/Flashcards';
import { Glossary } from './pages/Glossary';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
