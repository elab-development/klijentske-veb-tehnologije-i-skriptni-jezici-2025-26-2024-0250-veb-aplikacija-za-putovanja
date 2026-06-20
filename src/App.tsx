import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import Attractions from './pages/Attractions';
import Reviews from './pages/Reviews';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
export default App;