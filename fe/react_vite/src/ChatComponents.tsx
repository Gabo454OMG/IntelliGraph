import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatComponent.css';

interface Message {

  content: string;
  sender: string;
  timestamp: string;
  error?: boolean;

}

interface ListItem {

  id: number;
  name: string;
  count: number;

}

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isGifEnlarged, setIsGifEnlarged] = useState(false);
  // const sentSound = useRef(new Audio('/sounds/message-sent.mp3'));
  // const receivedSound = useRef(new Audio('/sounds/message-received.mp3'));
  // const startSound = useRef(new Audio('/sounds/start.mp3'));

  // Auto-scroll to bottom when new messages arrive (only if autoScroll is enabled)

const [listItems, setListItems] = useState<ListItem[]>([
  { id: 1, name: "Item 1", count: 0 },
  { id: 2, name: "Item 2", count: 0 },
  { id: 3, name: "Item 3", count: 0 },
  { id: 4, name: "Item 4", count: 0 },
]);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  // Detect manual scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Check if user has scrolled up (not at bottom)
      const isAtBottom = 
        container.scrollHeight - container.scrollTop <= container.clientHeight + 50; // 50px threshold
      
      setAutoScroll(isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const incrementItemCount = (id: number) => {
    setListItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  //useEffect(() => {
  //startSound.current.play();
  //}, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    //sentSound.current.play();

    const userMessage = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    // Re-enable auto-scroll when sending a new message
    setAutoScroll(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage.content
      });

      //receivedSound.current.play();

      const botMessage = {
        content: response.data.reply,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prevMessages => [...prevMessages, botMessage])
    }
    catch(error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        content: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        error: true
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="left-tab">
        <h2>Interactive List</h2>
        <ul className="interactive-list">
          {listItems.map(item => (
            <li key={item.id} onClick={() => incrementItemCount(item.id)}>
              <span className="item-name">{item.name}</span>
              <span className="item-count">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat Application</h2>
        </div>

        <div className="message-container" ref={messagesContainerRef}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.error ? 'error' : ''}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message loading">
              <div className="loading-indicator">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!autoScroll && (
          <button 
            className="scroll-to-bottom-btn" 
            onClick={() => {
              setAutoScroll(true);
              scrollToBottom();
            }}
          >
            ↓ Last messages
          </button>
        )}

        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type message here."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputMessage.trim()}>
            Send
          </button> 
        </form>
      </div>
      {isGifEnlarged && 
        <div className="overlay" onClick={() => setIsGifEnlarged(false)}></div>
        }
      <div className="right-tab">
        <h2>Diagram</h2>
        <div
         className={`gif-container ${isGifEnlarged ? 'enlarged' : ''}`}
         onClick={() => setIsGifEnlarged(!isGifEnlarged)}>
          <img
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmNlejdsZHFpdndtYzc4a2RoMnNhMjl4cTVvOGhycjNpb2FsM2ZpMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fbox1ygIqnga5dLinz/giphy.gif"
            alt="Animated GIF"
            className="display-gif"
            />
        </div>
        {isGifEnlarged && 
        <div className="click-info">Click again to reduce size</div>}
      </div>
    </div>
  );
};

export default ChatComponent;