import { fetchAPI } from '../../util';
import { useNavigate } from 'react-router';
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
            <h1>Edit {data ? data.language.name : 'Language'}</h1>
            <form method="post" onSubmit={handleSubmit}>
                <h3>Import new words</h3>
                <p>Type words in the following comma seperated format (definitions are optional):</p>
                <pre>english,translation,defintion</pre>
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
                    <li key={w.english}>{w.translation} - {w.english}{w.definition ? ` - ${w.definition}` : ''}</li>
                ))}
                </ul>
                </>
            )}
        </main>
        </>
    )
}
