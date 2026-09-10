import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/Pages/HomePage";
import LoginPage from "./components/Pages/LoginPage";
import RegisterPage from "./components/Pages/RegisterPage";
import SysAdminPage from './components/Roles/SysAdmin/SysAdminPage';
import AssetManagerPage from './components/Roles/AssetManager/AssetManagerPage';
import FinanceOfficerPage from './components/Roles/FinanceOfficer/FinanceOfficerPage';
import FieldOfficerPage from './components/Roles/FieldOfficer/FieldOfficerPage';
import AuditorPage from './components/Roles/Auditor/AuditorPage';
import PublicUserPage from './components/Roles/PublicUser/PublicUserPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sysAdmin" element={<SysAdminPage />} />
        <Route path="/asset-manager" element={<AssetManagerPage />} />
        <Route path="/finance-officer" element={<FinanceOfficerPage />} />
        <Route path="/field-officer" element={<FieldOfficerPage />} />
        <Route path="/auditor" element={<AuditorPage />} />
        <Route path="/public" element={<PublicUserPage />} />
      </Routes>
    </Router>
  );
};

export default App;