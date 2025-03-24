import { fetchAPI } from '../../util';
import { useNavigate } from 'react-router';
import { useEffect, useState, useTransition } from 'react';
import Header from '../../components/header';
import '../../styles/language/edit.css';

export function meta() {
  return [
    { title: `Edit Lesson` },
  ];
}

export default function EditLesson({params}) {
    const [error, setError] = useState('');
    const [title, setTitle] = useState(null);
    const [text, setText] = useState(null);
    const [submitting, startSubmission] = useTransition();
    let navigate = useNavigate();
    
    const fetchExisting = async () => {
        setError('');
        try {
            const r = await fetchAPI(`/lang/${params.lang_id}/lesson/${params.lesson_id}`, {
                method: 'GET'
            });
            const data = await r.json();
            if (!r.ok) {
                setError(data.error);
            } else {
                setTitle(data.title);
                setText(data.text);
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
          const r = await fetchAPI(`/lang/${params.lang_id}/lesson/${params.lesson_id}`, {
                method: 'POST',
                body: JSON.stringify({ title, text }),
                headers: {
                  'Content-Type': 'application/json'
                },
            });
            if (r.ok) {
              navigate(`/language/${params.lang_id}/lesson/${params.lesson_id}`);
            } else {
              r.json().then(r => {
                  if (Object.hasOwn(r, 'error')) {
                      setError(r.error);
                  } else {
                    setError('An unknown error occurred');
                  }
              })
            }
        } catch (e) {
            setError(e.message);
        }
      })
  };
    
    return (
        <>
        <Header />
        <main>
          {title == null && (
            <p>Loading...</p>
          )}
          {title != null && (
            <>
            <h1>Edit {title}</h1>
            <form method="post" onSubmit={handleSubmit}>
            
            <h3>Lesson Name</h3>
            <input required type="text" name="lesson_title" value={title} onChange={e => setTitle(e.target.value)} />
            <h3>Lesson Text</h3>
                <p>Images can be included via <a href="https://www.digitalocean.com/community/tutorials/markdown-markdown-images"> Markdown Format</a></p>
                <textarea rows="10" name="lesson_text" autoComplete="false" autoCorrect="false" value={text} onChange={e => setText(e.target.value)}></textarea>
                <button className="primary" type="submit" disabled={submitting}>Update</button>
            </form>
            </>
          )}
            {error && (
                <p className="error">{error}</p>
            )}
        </main>
        </>
    )
}
