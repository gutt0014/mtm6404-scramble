/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const { useState, useEffect } = React;

// List of words
const words = ['apple', 'banana', 'orange', 'grape', 'cherry', 'kiwi', 'melon', 'mango', 'pear', 'peach'];

function App() {
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);
  const [remainingWords, setRemainingWords] = useState([...words]);
  const [gameOver, setGameOver] = useState(false);

  // Load game state from local storage if exists
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (savedState) {
      setPoints(savedState.points);
      setStrikes(savedState.strikes);
      setPasses(savedState.passes);
      setRemainingWords(savedState.remainingWords);
      setScrambledWord(savedState.scrambledWord);
    } else {
      // Shuffle the words and set the initial scrambled word
      const shuffledWords = shuffle([...words]);
      setRemainingWords(shuffledWords);
      setScrambledWord(shuffle(shuffledWords[0]));
    }
  }, []);

  // Update local storage whenever the game state changes
  useEffect(() => {
    const gameState = {
      points,
      strikes,
      passes,
      remainingWords,
      scrambledWord,
    };
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState));
  }, [points, strikes, passes, remainingWords, scrambledWord]);

  // Shuffle function to scramble words
  function shuffle(src) {
    const copy = [...src];
    const length = copy.length;
    for (let i = 0; i < length; i++) {
      const x = copy[i];
      const y = Math.floor(Math.random() * length);
      const z = copy[y];
      copy[i] = z;
      copy[y] = x;
    }
    return typeof src === 'string' ? copy.join('') : copy;
  }

  // Handle guess submission
  function handleGuess(e) {
    e.preventDefault();
    if (guess.toLowerCase() === remainingWords[0].toLowerCase()) {
      setPoints(prevPoints => prevPoints + 1);
      setRemainingWords(prevWords => prevWords.slice(1));
      if (remainingWords.length > 1) {
        setScrambledWord(shuffle(remainingWords[1]));
      } else {
        setGameOver(true);
      }
    } else {
      setStrikes(prevStrikes => prevStrikes + 1);
    }
    setGuess('');
  }

  // Handle pass button
  function handlePass() {
    if (passes > 0 && remainingWords.length > 1) {
      setPasses(prevPasses => prevPasses - 1);
      setRemainingWords(prevWords => prevWords.slice(1));
      setScrambledWord(shuffle(remainingWords[1]));
    }
  }

  // Restart the game
  function handleRestart() {
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setRemainingWords([...words]);
    setScrambledWord(shuffle(words[0]));
    setGameOver(false);
  }

  return (
    <div className="game-container">
      <h1>Welcome to Scramble.</h1>
      <div className="score-container">
        <p>Points: {points}</p>
        <p>Strikes: {strikes}</p>
        <p>Passes Left: {passes}</p>
      </div>
      <div className="game-play">
        <p>{scrambledWord}</p>
        <form onSubmit={handleGuess}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={gameOver}
          />
          <button type="submit" disabled={gameOver}>Guess</button>
        </form>
        <button onClick={handlePass} disabled={passes <= 0 || gameOver}>Pass</button>
      </div>
      {gameOver && (
        <div>
          <p>Game Over!</p>
          <button onClick={handleRestart}>Play Again</button>
        </div>
      )}
    </div>
  );
}



const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
