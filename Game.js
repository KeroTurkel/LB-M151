import React, { useState, useEffect } from "react";
import "./Game.css"
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";

export default function Game() {

    const [word, setWord] = useState("".toUpperCase());
    const [question, setQuestion] = useState("");
    const [displayedWord, setDisplayedWord] = useState("");
    const [message, setMessage] = useState("");
    const [inputLetter, setInputLetter] = useState("");
    const [inputWord, setInputWord] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [lifePoints, setLifePoints] = useState(3);
    const [balance, setBalance] = useState(0);
    const [name, setName] = useState("");


    useEffect(() => {
        // Fetch categories from Firestore and update state
        const q = query(collection(db, "categories"));
        getDocs(q).then((querySnapshot) => {
            const categories = [];
            querySnapshot.forEach((doc) => {
                categories.push(doc.data());
            });
            setCategories(categories);
        });
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const randomWord = category.words[Math.floor(Math.random() * category.words.length)];
        setWord(randomWord.word.toUpperCase());
        setQuestion(randomWord.question);
        setDisplayedWord("_".repeat(randomWord.word.length));
    };

    const handleGuess = (e) => {
        e.preventDefault();

        const value = inputLetter.toUpperCase();
        word.toUpperCase();

        // Check if input letter is in the word
        if (value && word.includes(value)) {
            // Update displayed word
            let newDisplayedWord = "";
            for (let i = 0; i < word.length; i++) {
                if (word[i] === value) {
                    newDisplayedWord += value;

                } else {
                    newDisplayedWord += displayedWord[i];
                }
            }
            setDisplayedWord(newDisplayedWord);

            // Check if word is fully guessed
            if (newDisplayedWord === word) {
                setMessage("Congratulations, you guessed the word!");
            } else {
                setMessage("");
            }
        } else {
            setMessage("Letter not available!");
            setAttempt(attempt + 1);
            setLifePoints(lifePoints - 1);
        }
        setInputLetter("");
    };


    const handleGuessWord = (e) => {
        e.preventDefault();
        const value = inputWord.toUpperCase();

        if (value === word) {
            setDisplayedWord(word);
            setMessage("Congratulations, you guessed the word!");

        } else {
            setMessage("Wrong word");
            attempt = attempt + 1;
            setAttempt(attempt);
            setLifePoints(lifePoints - 1);
        }
        setInputWord("");
    };

    const handleRandomAmount = () => {
        const randomAmount = Math.floor(Math.random() * 10) + 1;
        if (randomAmount === 10) {
            setMessage("Bankrupt!");
            setBalance(0);
        } else {
            const amount = randomAmount * 100;
            setMessage(`Congratulations, you earned ${amount}!`);
            setBalance(balance + amount);
        }
    }

    useEffect(() => {
        if (lifePoints === 0) {
            setMessage("Game Over!");
            addDoc(collection(db, "Highscoreliste"), {
                name: name,
                balance: balance,
                time: serverTimestamp(),
                attempt: attempt
            });
        }
    }, [lifePoints]);

    const handleNameInput = (e) => {
        setName(e.target.value);
        }

    return (
        <div className="container-GameSite">
            <div>
                <label>
                    Enter your name:
                    <input type="text" onChange={handleNameInput} />
                </label>
            </div>
            {categories && (
                <div className="category-buttons">
                    {categories.map((category, index) => (
                        <button key={index} onClick={() => handleCategorySelect(category)}>
                            {category.category}
                        </button>
                    ))}
                </div>
            )}

            {selectedCategory && (
                <div>
                    <p>Kategorie: {selectedCategory.category}</p>
                    <div className="question">
                        <p>{question}</p>
                    </div>
                    <div className="displayWord">
                        <p>{displayedWord.split("").join(" ")}</p>
                    </div>

                    <form onSubmit={handleGuess}>
                        <label>
                            Guess a letter:
                            <input
                                type="text"
                                maxLength="1"
                                placeholder="Enter a letter"
                                value={inputLetter}
                                onChange={(e) => setInputLetter(e.target.value)}
                            />
                        </label>
                        <button type="submit">Guess</button>
                    </form>

                    <form onSubmit={handleGuessWord}>
                        <label>
                            Guess the whole word:
                            <input
                                type="text"
                                placeholder="Enter the word"
                                value={inputWord}
                                onChange={(e) => setInputWord(e.target.value)}
                            />
                        </label>
                        <button type="submit">Guess</button>
                    </form>

                    {message && <p>{message}</p>}
                    {attempt > 0 && <p>Attempt: {attempt}</p>}

                    <div className="balance">
                        <p>Balance: ${balance}</p>
                    </div>

                    <div>
                        <p>Lifepoints: {lifePoints}</p>
                    </div>

                    <button className="random-amount" onClick={handleRandomAmount}>
                        Spin the Wheel
                    </button>

                    {lifePoints === 0 && (
                        <div className="game-over">
                            <p>Game Over!</p>
                            <p>Your score:</p>
                            <p>Attempts: {attempt}</p>
                            <p>Balance: ${balance}</p>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}



