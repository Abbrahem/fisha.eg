import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
