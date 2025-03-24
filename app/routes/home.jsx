import { PRODUCT_NAME } from '../config';
import { fetchAPI } from '../util'
import { useNavigate, Link } from 'react-router';
import { useEffect, useState, useTransition, useContext } from 'react';
import Header from '../components/header';
import LanguageCreator from '../components/languageCreator';
import { UserContext } from '../userContext';
import '../styles/home.css';

export function meta() {
  return [
    { title: `${PRODUCT_NAME}` },
    { name: "description", content: `${PRODUCT_NAME}` },
  ];
}

export default function Home() {
  // Languages are objects w/ name and id properties
  const [languages, setLanguages] = useState(undefined);
  const [showCreator, setShowCreator] = useState(false);
  const [dataLoading, startFetch] = useTransition();
  const { email } = useContext(UserContext);
  let navigate = useNavigate();
  
  useEffect(() => {
    const controller = new AbortController();
    startFetch(async () => {
      const data = await fetchAPI("/lang", {
        method: 'GET',
        signal: controller.signal
      }).then(r => r.json());
      
      setLanguages(data);
    });
  
    return () => {
      controller.abort();
    };
  }, [fetchAPI, setLanguages]);
  
  const handleClickCreate = () => {
    if (showCreator) {
      return;
    }
    if (!email) {
      navigate('/login');
    }
    setShowCreator(true);
  }
  
  return (
      <>
      <Header />
      <main>
      <div className="title">
        <div></div>
        <h1>Languages</h1>
        <button className="primary" onClick={handleClickCreate}>Create</button>
      </div>
      {showCreator && (
        <LanguageCreator />
      )}
      {dataLoading && (
        <p>Loading...</p>
      )}
      {(!dataLoading && (languages?.length ?? -1)== 0) && (
        <p>No Languages yet. Create one now!</p>
      )}
      {(!dataLoading && (languages?.length ?? 0) > 0) && (
        <div className="languages">
        {languages.map(lang => (
          <div key={lang.id} className="language">
            <h3>{lang.name}</h3>
            <div>
            <Link to={`/language/${lang.id}`}><button className="primary">Learn</button></Link>
            <Link to={email ? `/language/${lang.id}/edit`: '/login'}><button className="secondary">Edit</button></Link>
            </div>
          </div>
        ))}
        </div>
      )} 
      </main>
      </>
  )
}
