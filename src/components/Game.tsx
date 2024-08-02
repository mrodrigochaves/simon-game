import React, { useState, useEffect } from 'react';
import Button from './Button';
import Header from './Header';
import '../assets/styles.css';

type ButtonColor = 'green' | 'red' | 'yellow' | 'blue';

type Color = ButtonColor | 'wrong';


const soundPaths: Record<Color, HTMLAudioElement> = {
  green: new Audio(require('../assets/sounds/green.mp3')),
  red: new Audio(require('../assets/sounds/red.mp3')),
  yellow: new Audio(require('../assets/sounds/yellow.mp3')),
  blue: new Audio(require('../assets/sounds/blue.mp3')),
  wrong: new Audio(require('../assets/sounds/wrong.mp3')),
};

const colors: ButtonColor[] = ['red', 'green', 'blue', 'yellow'];

const Game: React.FC = () => {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [pressedButton, setPressedButton] = useState<ButtonColor | null>(null);
  const [showSequence, setShowSequence] = useState<boolean>(false);

  useEffect(() => {
    if (sequence.length === 0) {
      nextSequence();
    } else {
      playSequence();
    }
  }, [sequence]);

  const playSound = (color: Color) => {
    soundPaths[color].play();
  };

  const playSequence = () => {
    setShowSequence(true);
    let i = 0;
    const interval = setInterval(() => {
      const color = sequence[i] as ButtonColor; 
      playSound(color);
      setPressedButton(color);
      setTimeout(() => setPressedButton(null), 500);
      i += 1;
      if (i >= sequence.length) {
        clearInterval(interval);
        setShowSequence(false);
      }
    }, 1000);
  };

  const nextSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prev) => [...prev, newColor]);
    setUserSequence([]);
    setLevel((prev) => prev + 1);
  };

  const handleClick = (color: ButtonColor) => {
    if (gameOver || showSequence) return;

    playSound(color);
    setUserSequence((prev) => [...prev, color]);

    if (color !== sequence[userSequence.length]) {
      playSound('wrong');
      setGameOver(true);
      return;
    }

    if (userSequence.length + 1 === sequence.length) {
      nextSequence();
    }
  };

  const handleKeyPress = () => {
    if (gameOver) {
      setGameOver(false);
      setSequence([]);
      nextSequence();
    }
  };

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        handleKeyPress();
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [gameOver]);

  return (
    <div>
      <Header />
      <div className="container">
        {colors.map((color) => (
          <Button
            key={color}
            id={color}
            color={color}
            onClick={handleClick}
            pressed={pressedButton === color}
            className={showSequence && pressedButton === color ? 'pulsing' : ''}
          />
        ))}
        {gameOver && <div className="game-over">Game Over</div>}
      </div>
    </div>
  );
};

export default Game;
