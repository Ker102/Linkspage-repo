import React from 'react';
import { CanvasWrapper } from './components/CanvasWrapper';
import { UIOverlay } from './components/UIOverlay';

const App: React.FC = () => {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden selection:bg-purple-500 selection:text-white">
      <CanvasWrapper />
      <UIOverlay />
    </main>
  );
};

export default App;