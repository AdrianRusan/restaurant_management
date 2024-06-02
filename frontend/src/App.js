import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';

const ProtectedHome = RequireAuth(Home)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedHome />} />
      </Routes>
    </Router>
  );
}

export default App;