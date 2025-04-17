import { Link } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>WAZAAAAAA</h1>
        <p>This is a demo of a chat interface using React-Vite and Flask.</p>
        
        <Link to="/chat" className="start-button">
          Start Chatting
        </Link>
      </div>
    </div>
  );
};

export default HomePage;