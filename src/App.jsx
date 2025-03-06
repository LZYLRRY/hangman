import { languages } from "./assets/languages";
import { useState } from "react";

function App() {
  const [currentWord, setCurrentWord] = useState("react");
  const [letterChoice, setLetterChoice] = useState([]);
  console.log(letterChoice);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const keyboardElement = alphabet.split("").map((letter, index) => {
    return (
      <button
        onClick={() => handleKeyboard(letter)}
        key={index}
        className="keyboard__letter"
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const wordElement = currentWord.split("").map((letter, index) => {
    return (
      <span key={index} className="word__letter">
        {letter.toUpperCase()}
      </span>
    );
  });

  const languagesElement = languages.map((language) => {
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    return (
      <span key={language.name} className="language__chips" style={styles}>
        {language.name}
      </span>
    );
  });

  function handleKeyboard(letter) {
    setLetterChoice((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  return (
    <>
      <main>
        <header className="header">
          <h1 className="header__title">Assembly: Endgame</h1>
          <p className="header__description">
            Guess the word in under 8 attempts to keep the programming world
            safe from Assembly!
          </p>
        </header>
        <section className="game-status">
          <h2 className="game-status__title">You win!</h2>
          <p className="game-status__description">Well done 🎉</p>
        </section>
        <section className="language">{languagesElement}</section>
        <section className="word">{wordElement}</section>
        <section className="keyboard">{keyboardElement}</section>
        <section className="new-game">
          <button className="new-game__button">New Game</button>
        </section>
      </main>
    </>
  );
}

export default App;
