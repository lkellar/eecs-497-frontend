import { fetchAPI, mod } from '../../util';
import { useNavigate, Link } from 'react-router';
import { useEffect, useState, useTransition } from 'react';
import Header from '../../components/header';
import Flashcard from '../../components/flashcard';
import '../../styles/language/learn.css';

export function meta() {
  return [
    { title: `Learn Language` },
  ];
}

// right now it's just flashcards, later we can expand to lessons
export default function LearnLanguage({params}) {
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        async function main() {
            setError('');
            try {
                const r = await fetchAPI(`/lang/${params.lang_id}`, {method: 'GET'});
                const data = await r.json();
                if (!r.ok) {
                    setError(data.error)
                } else {
                    // TODO: would be neat to shuffle the words each time
                    setData(data);
                }
            } catch (e) {
                setError(e.message);
            }
        }
        main();
    }, []);
    
    const adjustIndex = delta => {
        if (!data?.words) {
            return;
        }
        const wordCount = data.words.length;
        setCurrentIndex(prev => mod(prev + delta, data.words.length));
    }
    
    return (
        <>
        <Header />
        <main>
            <h1>Learn {data ? data.language.name : 'Language'}</h1>
            <div className="content">
                {data == null && (
                    <p>Loading...</p>
                )}
                {error && (
                    <p className="error">{error}</p>
                )}
                {data && data.words.length == 0 && (
                    <p>No words yet to learn!</p>
                )}
                {data?.words?.length > 0 && (
                    <>
                    <Flashcard 
                        english={data.words[currentIndex].english}
                        translation={data.words[currentIndex].translation}
                        definition={data.words[currentIndex].definition}
                    />
                    <div className="flash_controls">
                    <button onClick={() => adjustIndex(-1)} className="secondary">Previous</button>
                    <button onClick={() => adjustIndex(1)} className="secondary">Next</button>
                    </div>
                    </>
                )}
            </div>
        </main>
        {data != null && (
          <footer className="box">
          <h3>Lessons</h3>
          {data.lessons.length > 0 && (
            <div className="lesson_carousel">{data.lessons.map(lesson => (
              <div className="lesson_card" key={lesson.id}>
              <h4>{lesson.title}</h4>
              <Link to={`/language/${params.lang_id}/lesson/${lesson.id}`}><button className="primary">Read</button></Link>
              </div>
            ))}</div>
          )}
          {data.lessons.length == 0 && (
            <p>No lessons created yet!</p>
          )}
          </footer>
        )}
        </>
    )
}
