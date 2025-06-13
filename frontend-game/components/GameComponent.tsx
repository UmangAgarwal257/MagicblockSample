'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface GameState {
  position: { x: number; y: number; z: number };
  velocity: { vx: number; vy: number };
  entityId: string | null;
}

export function GameComponent() {
  const { publicKey, connected } = useWallet();
  const [gameState, setGameState] = useState<GameState>({
    position: { x: 0, y: 0, z: 0 },
    velocity: { vx: 0, vy: 0 },
    entityId: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Connect wallet to start playing');

  useEffect(() => {
    if (connected) {
      setStatus('Wallet connected! Ready to play');
    } else {
      setStatus('Connect wallet to start playing');
    }
  }, [connected]);

  const initializeGame = async () => {
    if (!publicKey) {
      setStatus('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setStatus('Initializing game...');
    
    try {
      // In a real implementation, you would:
      // 1. Create a new entity
      // 2. Initialize position and velocity components
      // 3. Store the entity ID
      
      // For now, we'll simulate this with a mock entity
      const mockEntityId = Math.random().toString(36).substring(7);
      setGameState({
        position: { x: 0, y: 0, z: 0 },
        velocity: { vx: 0, vy: 0 },
        entityId: mockEntityId
      });
      
      setStatus('Game initialized! Use the controls below to move your character.');
    } catch (error) {
      console.error('Error initializing game:', error);
      setStatus('Error initializing game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const moveCharacter = async () => {
    if (!publicKey || !gameState.entityId) {
      setStatus('Please initialize the game first');
      return;
    }

    setIsLoading(true);
    setStatus('Moving character...');
    
    try {
      // In a real implementation, you would:
      // 1. Create a transaction that calls the movement system
      // 2. Sign and send the transaction
      // 3. Update the game state based on the result
      
      // For now, we'll simulate the movement
      setGameState(prev => ({
        ...prev,
        position: {
          x: prev.position.x + 1,
          y: prev.position.y + 1,
          z: prev.position.z
        }
      }));
      
      setStatus('Character moved successfully!');
    } catch (error) {
      console.error('Error moving character:', error);
      setStatus('Error moving character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setVelocity = async (vx: number, vy: number) => {
    if (!publicKey || !gameState.entityId) {
      setStatus('Please initialize the game first');
      return;
    }

    setIsLoading(true);
    setStatus('Setting velocity...');
    
    try {
      // In a real implementation, you would update the velocity component
      setGameState(prev => ({
        ...prev,
        velocity: { vx, vy }
      }));
      
      setStatus(`Velocity set to vx: ${vx}, vy: ${vy}`);
    } catch (error) {
      console.error('Error setting velocity:', error);
      setStatus('Error setting velocity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyVelocity = async () => {
    if (!publicKey || !gameState.entityId) {
      setStatus('Please initialize the game first');
      return;
    }

    setIsLoading(true);
    setStatus('Applying velocity...');
    
    try {
      // In a real implementation, you would call the apply-velocity system
      setGameState(prev => ({
        ...prev,
        position: {
          x: prev.position.x + prev.velocity.vx,
          y: prev.position.y + prev.velocity.vy,
          z: prev.position.z
        }
      }));
      
      setStatus('Velocity applied successfully!');
    } catch (error) {
      console.error('Error applying velocity:', error);
      setStatus('Error applying velocity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Magic ECS Game
          </h1>
          <p className="text-xl text-gray-300">
            A simple ECS game powered by Solana and Bolt
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wallet Connection */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Wallet Connection</h2>
            <div className="flex flex-col items-center space-y-4">
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700" />
              <p className="text-center text-gray-300">{status}</p>
            </div>
          </div>

          {/* Game State */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Game State</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Entity ID:</span>
                <span className="text-white font-mono">
                  {gameState.entityId || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Position:</span>
                <span className="text-white font-mono">
                  ({gameState.position.x}, {gameState.position.y}, {gameState.position.z})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Velocity:</span>
                <span className="text-white font-mono">
                  ({gameState.velocity.vx}, {gameState.velocity.vy})
                </span>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Game Controls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Actions</h3>
                <button
                  onClick={initializeGame}
                  disabled={!connected || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isLoading ? 'Initializing...' : 'Initialize Game'}
                </button>
                
                <button
                  onClick={moveCharacter}
                  disabled={!connected || !gameState.entityId || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isLoading ? 'Moving...' : 'Move (+1, +1)'}
                </button>
              </div>

              {/* Velocity Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Velocity System</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setVelocity(1, 0)}
                    disabled={!connected || !gameState.entityId || isLoading}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                  >
                    Right (1,0)
                  </button>
                  <button
                    onClick={() => setVelocity(-1, 0)}
                    disabled={!connected || !gameState.entityId || isLoading}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                  >
                    Left (-1,0)
                  </button>
                  <button
                    onClick={() => setVelocity(0, 1)}
                    disabled={!connected || !gameState.entityId || isLoading}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                  >
                    Up (0,1)
                  </button>
                  <button
                    onClick={() => setVelocity(0, -1)}
                    disabled={!connected || !gameState.entityId || isLoading}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                  >
                    Down (0,-1)
                  </button>
                </div>
                
                <button
                  onClick={applyVelocity}
                  disabled={!connected || !gameState.entityId || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isLoading ? 'Applying...' : 'Apply Velocity'}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Game Board */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Game Board</h2>
            <div className="relative bg-black/30 rounded-lg p-4 min-h-[300px] border border-white/10">
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1 p-4">
                {Array.from({ length: 100 }, (_, i) => {
                  const x = i % 10;
                  const y = Math.floor(i / 10);
                  const isPlayerPosition = gameState.entityId && 
                    Math.abs(x - 5 + gameState.position.x) < 0.5 && 
                    Math.abs(y - 5 + gameState.position.y) < 0.5;
                  
                  return (
                    <div
                      key={i}
                      className={`rounded border border-white/20 flex items-center justify-center text-xs ${
                        isPlayerPosition 
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold' 
                          : 'bg-white/5'
                      }`}
                    >
                      {isPlayerPosition && '🎮'}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-center text-gray-300 mt-4">
              Your character position: ({gameState.position.x}, {gameState.position.y})
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Connect Wallet</h3>
              <p>Connect your Phantom wallet to interact with the game</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Initialize Game</h3>
              <p>Create your character entity with position and velocity components</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Move Around</h3>
              <p>Use the movement system or set velocity and apply it to move your character</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
