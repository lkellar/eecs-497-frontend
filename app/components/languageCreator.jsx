import { PRODUCT_NAME } from '../config'
import { useTransition, useState } from 'react';
import { fetchAPI } from '../util';
import { useNavigate } from 'react-router';
import '../styles/languageCreator.css';

// meant to be used within an existing page
export default function LanguageCreator() {
  const [creationPending, startCreation] = useTransition();
  const [error, setError] = useState('');
  let navigate = useNavigate();
  
  const handleSubmit = event => {
      startCreation(async () => {
        event.preventDefault();
        
        setError('');
        const name = event.target.lang_name.value;
        await fetchAPI('/lang/create', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: {
              'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            if (Object.hasOwn(r, 'error')) {
                setError(r.error);
            } else if (Object.hasOwn(r, 'id')) {
                navigate(`/language/${r.id}/edit`);
            } else {
                setError('Unknown error occurred');
            }
        })
      });
  }

  return (
    <form className="lang_creator" method="post" onSubmit={handleSubmit}>
        <label htmlFor="lang_name">Language Name</label>
        <input type="text" name="lang_name"  />
        <button className="primary" type="submit" disabled={creationPending}>Create</button>
        
        {error && (
          <p className="error">{error}</p>
        )}
    </form>
  )   
}