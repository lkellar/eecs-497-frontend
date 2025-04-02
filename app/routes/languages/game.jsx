import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetchAPI } from '../../util';
import '../../styles/language/game.css';
import '../../styles/app.css';

export default function LanguageGame() {
    const { lang_id } = useParams();
    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const [lives, setLives] = useState(3);
    const [input, setInput] = useState('');
    const [showGameOver, setShowGameOver] = useState(false);
    
    const thirds = useRef(['10%', '40%', '70%']);
    const availableThirds = useRef([...thirds.current]);
    const initialized = useRef(false);
    const intervalId = useRef(null);
    const wordsRef = useRef(words);

    useEffect(() => {
        wordsRef.current = words;
    }, [words]);

    const [wordThreshold, setWordThreshold] = useState(window.innerHeight - 400);

    useEffect(() => {
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            const rect = gameArea.getBoundingClientRect();
            setWordThreshold(rect.bottom + window.scrollY - (rect.height / 2));
        }
    }, []);

    useEffect(() => {
        async function fetchWords() {
            try {
                const r = await fetchAPI(`/lang/${lang_id}`, { method: 'GET' });
                if (!r.ok) throw new Error('Failed to fetch words');
                const data = await r.json();
                if (data.words.length > 0) {
                    const initialWords = data.words.slice(0, 3).map(assignWordProps);
                    setWords(initialWords.filter(Boolean));
                }
            } catch (e) {
                console.error('Error fetching words:', e);
            }
        }
        
        if (!initialized.current) {
            initialized.current = true;
            fetchWords();
        }
    }, [lang_id]);

    function assignWordProps(word) {
        if (availableThirds.current.length === 0) return null;

        const newLeftIndex = Math.floor(Math.random() * availableThirds.current.length);
        const newLeft = availableThirds.current[newLeftIndex];

        availableThirds.current = availableThirds.current.filter(pos => pos !== newLeft);

        return {
            ...word,
            id: Math.random(),
            y: 0,
            speed: Math.random() * 3 + 5,
            left: newLeft,
        };
    }

    useEffect(() => {
        if (lives <= 0) {
            setShowGameOver(true);
            if (intervalId.current) clearInterval(intervalId.current);
            return;
        }

        intervalId.current = setInterval(() => {
            const currentWords = wordsRef.current;
            
            const updatedWords = currentWords.map(word => ({
            ...word,
            y: word.y + word.speed
            }));

            const crossedWords = updatedWords.filter(word => 
            word.y >= wordThreshold && 
            !availableThirds.current.includes(word.left)
            );

            if (crossedWords.length > 0) {
            setLives(l => Math.max(l - crossedWords.length, 0));
            crossedWords.forEach(word => {
                availableThirds.current.push(word.left);
            });
            }

            const remainingWords = updatedWords.filter(word => 
            !crossedWords.some(cw => cw.id === word.id)
            );

            setWords(remainingWords);
        }, 100);

        return () => clearInterval(intervalId.current);
    }, [lives, wordThreshold]);

    const checkInput = () => {
        setWords(prevWords => prevWords.filter(word => {
            if (word.english.toLowerCase() === input.toLowerCase()) {
                availableThirds.current.push(word.left);
                return false;
            }
            return true;
        }));
        setInput('');
    };

    const restartGame = () => {
        setLives(3);
        setWords([]);
        availableThirds.current = [...thirds.current];
        setShowGameOver(false); 
        fetchWords(); 
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }

        intervalId.current = setInterval(() => {
            setWords(prevWords => prevWords.map(word => ({
                ...word,
                y: word.y + word.speed
            })).filter(word => {
                if (word.y >= wordThreshold) {
                    availableThirds.current.push(word.left);
                    return false;
                }
                return true;
            }));
        }, 100);
    };

    useEffect(() => {
        if (words.length < 3 && availableThirds.current.length > 0) {
            fetchAPI(`/lang/${lang_id}`, { method: 'GET' })
                .then(r => r.json())
                .then(data => {
                    if (data.words.length > 0) {
                        const newWord = assignWordProps(
                            data.words[Math.floor(Math.random() * data.words.length)]
                        );
                        if (newWord) {
                            setWords(prev => [...prev, newWord]);
                        }
                    }
                });
        }
    }, [words.length]);

    return (
        <div className="game-container">
            <button onClick={() => navigate(`/language/${lang_id}`)} className="back-button">Back</button>
            <h1>Translate the falling words!</h1>
            <h2>Lives: {lives}</h2>
            <div className="game-area">
                {words.map(word => (
                    <div key={word.id} className="falling-word" style={{ top: `${word.y}px`, left: word.left }}>
                        {word.translation}
                    </div>
                ))}
            </div>
            <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && checkInput()}
                placeholder="Type the English translation..."
                disabled={lives <= 0} 
            />
            {showGameOver && (
                <div className="game-over-box">
                    <h2>Game Over</h2>
                    <button className="primary" onClick={restartGame}>Restart</button>
                </div>
            )}
        </div>
    );
}
