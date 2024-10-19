import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Fallback route to catch errors */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
