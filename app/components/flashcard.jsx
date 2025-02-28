import { useState, useEffect } from 'react';
import '../styles/flashcard.css';

export default function Flashcard({english, translation, definition}) {
    const [answerShown, setAnswerShown] = useState(false);
    // whenever we get a new word, don't show the anaswer
    useEffect(() => {
        setAnswerShown(false);
    }, [english])
    return (
        <div className="flashcard">
        {!answerShown && (
            <>
            <h2>{translation}</h2>
            <button onClick={() => setAnswerShown(true)} className="primary">Show Answer</button>
            </>
        )}
        {answerShown && (
            <>
            <h2>{english}</h2>
            {definition && (
                <p>{definition}</p>
            )}
            <button onClick={() => setAnswerShown(false)} className="primary">Show Original</button>
            </>
        )}
        </div>
    )
}