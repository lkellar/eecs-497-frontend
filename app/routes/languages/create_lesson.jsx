import { fetchAPI } from '../../util';
import { useNavigate } from 'react-router';
import { useEffect, useState, useTransition } from 'react';
import Header from '../../components/header';
import '../../styles/language/edit.css';

export function meta() {
  return [
    { title: `Create Lesson` },
  ];
}

export default function CreateLesson({params}) {
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [submitting, startSubmission] = useTransition();
    let navigate = useNavigate();
    
    const fetchExisting = async () => {
        setError('');
        try {
            const r = await fetchAPI(`/lang/${params.lang_id}`, {
                method: 'GET'
            });
            const data = await r.json();
            if (!r.ok) {
                setError(data.error);
            } else {
                setData(data);
            }
        } catch (e) {
            setError(e.message);
        }
    }
    
    useEffect(() => {
        fetchExisting();
    }, []);
    
    const handleSubmit = event => {
      startSubmission(async () => {
        event.preventDefault();
        
        setError('');
        
        const title = event.target.lesson_title.value;
        const text = event.target.lesson_text.value;
        if (title.length == 0 || text.length == 0) {
          setError('Both Name and Text must be filled out');
          return;
        }
        try {
          await fetchAPI(`/lang/${params.lang_id}/lesson`, {
                method: 'POST',
                body: JSON.stringify({ title, text }),
                headers: {
                  'Content-Type': 'application/json'
                },
            })
            .then(r => r.json())
            .then(r => {
                if (Object.hasOwn(r, 'error')) {
                    setError(r.error);
                } else if (Object.hasOwn(r, 'id')) {
                    navigate(`/language/${params.lang_id}/lesson/${r.id}`);
                } else {
                    setError('Unknown error occurred');
                }
            })
        } catch (e) {
            setError(e.message);
        }
      })
  };
    
    return (
        <>
        <Header />
        <main>
            <h1>Create Lesson for {data ? data.language.name : 'Language'}</h1>
            <form method="post" onSubmit={handleSubmit}>
            
            <h3>Lesson Name</h3>
            <input required type="text" name="lesson_title"  />
            <h3>Lesson Text</h3>
                <p>Images can be included via <a href="https://www.digitalocean.com/community/tutorials/markdown-markdown-images"> Markdown Format</a></p>
                <textarea rows="10" name="lesson_text" autoComplete="false" autoCorrect="false"></textarea>
                <button className="primary" type="submit" disabled={submitting}>Create</button>
            </form>
            {error && (
                <p className="error">{error}</p>
            )}
        </main>
        </>
    )
}
