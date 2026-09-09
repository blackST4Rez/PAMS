import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/Pages/HomePage";
import LoginPage from "./components/Pages/LoginPage";
import RegisterPage from "./components/Pages/RegisterPage";
import SysAdminPage from './components/Roles/SysAdmin/SysAdminPage';
import AssetManagerPage from './components/Roles/AssetManager/AssetManagerPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sysAdmin" element={<SysAdminPage />} />
        <Route path="/asset-manager" element={<AssetManagerPage />} />
      </Routes>
    </Router>
  );
};

export default App;