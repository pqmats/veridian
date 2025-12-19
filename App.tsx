
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinancialProvider } from './context/FinancialContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Goals from './pages/Goals';
import Investments from './pages/Investments';
import Predictions from './pages/Predictions';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <FinancialProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth onLogin={login} />} />
          
          {/* Protected Routes */}
          <Route element={isAuthenticated ? <Layout onLogout={logout} /> : <Navigate to="/auth" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </FinancialProvider>
  );
};

export default App;
