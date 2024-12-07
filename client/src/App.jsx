import { useContext } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { AuthContext } from './context/authContext';

// Import components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import TreasureHuntGame from './components/Game/TreasureHunt';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <Login /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/register" 
            element={!token ? <Register /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/home" 
            element={token ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/room/:roomId" 
            element={token ? <TreasureHuntGame /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={token ? "/home" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;