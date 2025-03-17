import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

// Card images (Use placeholder images for debugging)
const cardImages = [
    { src: "/card1.png", matched: false },
    { src: "/card2.png", matched: false },
    { src: "/card3.png", matched: false },
    { src: "/card4.png", matched: false },
    { src: "/card5.png", matched: false },
    { src: "/card6.png", matched: false },
    { src: "/card7.png", matched: false },
    { src: "/card8.png", matched: false },
];

function App() {
    const [cards, setCards] = useState([]);
    const [firstChoice, setFirstChoice] = useState(null);
    const [secondChoice, setSecondChoice] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [difficulty, setDifficulty] = useState(4);
    const [intervalId, setIntervalId] = useState(null);

    // Start a new game
    const startGame = () => {
        const numPairs = (difficulty * difficulty) / 2; // Number of pairs
        const selectedImages = cardImages.slice(0, numPairs);
        const shuffled = [...selectedImages, ...selectedImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        console.log("Shuffled Cards:", shuffled); // Debugging

        setCards(shuffled);
        setFirstChoice(null);
        setSecondChoice(null);
        setMoves(0);
        setIsGameOver(false);
        setTimer(0);

        if (intervalId) clearInterval(intervalId);
        const newIntervalId = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);
        setIntervalId(newIntervalId);
    };

    useEffect(() => {
        console.log("Difficulty changed:", difficulty);
        startGame();
    }, [difficulty]);

    useEffect(() => {
        if (cards.length > 0 && cards.every((card) => card.matched)) {
            setIsGameOver(true);
            clearInterval(intervalId);
        }
    }, [cards]);

    const handleChoice = (card) => {
        if (!disabled) {
            firstChoice ? setSecondChoice(card) : setFirstChoice(card);
        }
    };

    useEffect(() => {
        if (firstChoice && secondChoice) {
            setDisabled(true);
            setMoves((prevMoves) => prevMoves + 1);

            if (firstChoice.src === secondChoice.src) {
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.src === firstChoice.src ? { ...card, matched: true } : card
                    )
                );
            }

            setTimeout(() => {
                setFirstChoice(null);
                setSecondChoice(null);
                setDisabled(false);
            }, 1000);
        }
    }, [firstChoice, secondChoice]);

    return (
        <div className="game">
            <h1>Memory Card Game</h1>
            <button onClick={startGame}>🔄 New Game</button>
            <p>Moves: {moves} | Time: {timer} sec</p>
            <div className="difficulty">
                <button onClick={() => setDifficulty(4)}>4x4</button>
                <button onClick={() => setDifficulty(6)}>6x6</button>
            </div>
            {isGameOver && <h2>🎉 You won in {moves} moves! Time: {timer}s 🎉</h2>}
            <div className="grid" style={{ gridTemplateColumns: `repeat(${difficulty}, 120px)` }}>
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        className={`card ${card === firstChoice || card === secondChoice || card.matched ? "flipped" : ""}`}
                        onClick={() => handleChoice(card)}
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: card === firstChoice || card === secondChoice || card.matched ? 0 : 180 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src={card.src} alt="card" className="card-front" />
                        <div className="card-back"></div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default App;
