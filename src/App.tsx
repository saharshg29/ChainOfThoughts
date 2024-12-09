import Chat from './components/Chat';
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Chain of Thoughts</h1>
      <Chat />
      <Analytics />

    </div>
  );
}

export default App;

