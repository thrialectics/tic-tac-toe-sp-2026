import { useState } from "react";
import GameLobby from "./GameLobby";
import GameView from "./GameView";
import "./App.css";

type AppView = 'lobby' | 'game';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('lobby');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  function handleGameSelect(id: string) {
    setSelectedGameId(id);
    setCurrentView('game');
  }

  function handleBackToLobby() {
    setSelectedGameId(null);
    setCurrentView('lobby');
  }

  if (currentView === "lobby") {
    return (
      <div className="game-container">
        <h1>Serpents & Doves</h1>
        <p><em>a game of three in a row</em></p>
        <GameLobby onGameSelect={handleGameSelect} />
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>Serpents & Doves</h1>
      <p><em>a game of three in a row</em></p>
      <GameView
        gameId={selectedGameId!}
        onBackToLobby={handleBackToLobby}
        onGameSelect={handleGameSelect}
      />
    </div>
  );
}

export default App;
