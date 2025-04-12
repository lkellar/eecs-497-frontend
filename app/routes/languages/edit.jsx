import { fetchAPI } from '../../util';
import { useNavigate, Link } from 'react-router';
import { API_BASE_URL } from '../../config';
import { useEffect, useState, useTransition } from 'react';
import Header from '../../components/header';
import '../../styles/language/edit.css';

export function meta() {
  return [
    { title: `Edit Language` },
  ];
}

export default function EditLanguage({params}) {
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [submitting, startSubmission] = useTransition();
    
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
    
    const deleteWord = word_id => {
      startSubmission(async () => {
        setError('');
        
        try {
          const r = await fetchAPI(`/lang/${params.lang_id}/word/${word_id}`, {
            method: 'DELETE'
          });
          if (!r.ok) {
              const data = await r.json();
              setError(data.error);
          }
        } catch (e) {
          setError(e.message);
        }
        
        await fetchExisting();
      });
    }
    
    useEffect(() => {
        fetchExisting();
    }, []);
    
    const handleSubmit = event => {
      startSubmission(async () => {
        event.preventDefault();
        
        setError('');
        const raw_words = event.target.words.value;
        const words = raw_words.split('\n').map(line => {
            const splits = line.split(',');
            return {
                english: splits[0],
                translation: splits[1],
                ...(splits.length > 2 ? {definition: splits[2]} : {})
            }
        });
        try {
            const r = await fetchAPI(`/lang/${params.lang_id}/import`, {
                method: 'POST',
                body: JSON.stringify({ words }),
                headers: {
                  'Content-Type': 'application/json'
                },
            });
            if (!r.ok) {
                const data = await r.json();
                setError(data.error);
            } else {
                await fetchExisting();
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
            <div className='title'>
            <Link to={`${API_BASE_URL}/lang/${params.lang_id}/export`}><button className="secondary">Export</button></Link>
            <h1>Edit {data ? data.language.name : 'Language'}</h1>
            <Link to={`/language/${params.lang_id}/lesson/create`}><button className="secondary">Create Lesson</button></Link>
            </div>
            <form method="post" onSubmit={handleSubmit}>
                <h3>Import new words</h3>
                <p>Type words in the following comma separated format (definitions are optional):</p>
                <pre>english,translation,definition</pre>
                <textarea rows="10" name="words" autoComplete="false" autoCorrect="false"></textarea>
                <button className="primary" type="submit" disabled={submitting}>Import</button>
            </form>
            {data == null && (
                <p>Loading...</p>
            )}
            {error && (
                <p className="error">{error}</p>
            )}
            {data?.words && (
                <>
                <h3>Existing Words</h3>
                <ul>
                {data.words.map(w => (
                    <li key={w.english}>{w.translation} - {w.english}{w.definition ? ` - ${w.definition}` : ''}<a className="delete-link" onClick={e => {e.preventDefault(); deleteWord(w.id)}}>Delete</a></li>
                ))}
                </ul>
                </>
            )}
        </main>
        </>
    )
}
