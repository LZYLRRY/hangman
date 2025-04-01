import { languages } from "./assets/languages";
import { useState } from "react";
import { clsx } from "clsx";
import { getFarewellText, getRandomWord } from "./components/utils";
import Confetti from "react-confetti";

function App() {
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  // Derived values
  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const keyboardElement = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    const className = clsx("keyboard__letter", {
      "keyboard__letter--correct": isCorrect,
      "keyboard__letter--wrong": isWrong,
    });

    return (
      <button
        onClick={() => addGuessedLetter(letter)}
        key={index}
        className={className}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const wordElement = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);
    const letterClassName = clsx("word__letter", {
      "word__letter--reveal": isGameLost && !guessedLetters.includes(letter),
    });
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  const languagesElement = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount;

    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };

    const className = clsx(
      "language__chips",
      isLanguageLost && "language__chips--lost"
    );

    return (
      <span key={language.name} className={className} style={styles}>
        {language.name}
      </span>
    );
  });

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  const gameStatusClass = clsx("game-status", {
    "game-status--won": isGameWon,
    "game-status--lost": isGameLost,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="game-status game-status--farewell">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2 className="game-status__title">You win!</h2>
          <p className="game-status__description">Well done! 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2 className="game-status__title">Game over!</h2>
          <p className="game-status__description">
            You lose! Better start learning Assembly 😭
          </p>
        </>
      );
    }

    return null;
  }

  return (
    <>
      <main className="main">
        {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
        <header className="header">
          <h1 className="header__title">Assembly: Endgame</h1>
          <p className="header__description">
            Guess the word in under 8 attempts to keep the programming world
            safe from Assembly!
          </p>
        </header>
        <section className={gameStatusClass} aria-live="polite" role="status">
          {renderGameStatus()}
        </section>
        <section className="language">{languagesElement}</section>
        <section className="word">{wordElement}</section>

        {/* Combined visually-hidden aria-live region for status updates */}
        <section className="sr-only" aria-live="polite" role="status">
          <p>
            {currentWord.includes(lastGuessedLetter)
              ? `Correct! The letter ${lastGuessedLetter} is in the word.`
              : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
            You have {numGuessesLeft} attempts left.
          </p>
          <p>
            Current word:{" "}
            {currentWord
              .split("")
              .map((letter) =>
                guessedLetters.includes(letter) ? letter + "." : "blank."
              )
              .join(" ")}
          </p>
        </section>

        <section className="keyboard">{keyboardElement}</section>
        <section className="new-game">
          {isGameOver && (
            <button className="new-game__button" onClick={startNewGame}>
              New Game
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
