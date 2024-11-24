import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importando o AuthProvider
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Dashboard from './pages/client/Dashboard';
import Transfer from './pages/client/Transfer';
import Statement from './pages/client/Statement';
import Profile from './pages/client/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOperations from './pages/admin/AdminOperations';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageClients from './pages/admin/AdminManageClients';
import ClientLayout from './pages/client/ClientLayout';
import Loans from './pages/client/Loans';
import OfferDetails from './pages/client/OfferDetails'; // Novo componente de detalhes da oferta
import UserProfile from './pages/client/UserProfile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página de Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas do Cliente que requerem autenticação */}
          <Route element={<ClientLayout />}>
            <Route path="/loans" element={<Loans />} />
            <Route path="/offer-details" element={<OfferDetails />} /> {/* Nova Rota */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/statement" element={<Statement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<UserProfile />} />
          </Route>

          {/* Rotas Administrativas */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/operations" element={<AdminOperations />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-clients" element={<AdminManageClients />} />

          {/* Redireciona qualquer rota desconhecida para /login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
