import React from 'react';
import { CanvasWrapper } from './components/CanvasWrapper';

const App: React.FC = () => {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden selection:bg-purple-500 selection:text-white">
      <CanvasWrapper />
    </main>
  );
};

export default App;