import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Home.tsx';
import ChatComponent from './ChatComponents.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </Router>
  );
}

export default App;