import { PRODUCT_NAME } from '../config';
import { fetchAPI } from '../util'
import { useNavigate, Link } from 'react-router';
import { useEffect, useState, useTransition, useContext } from 'react';
import Header from '../components/header';
import LanguageCreator from '../components/languageCreator';
import { UserContext } from '../userContext';
import '../styles/home.css';
import defaultImage from "../../public/logo.png";

export function meta() {
  return [
    { title: `${PRODUCT_NAME}` },
    { name: "description", content: `${PRODUCT_NAME}` },
  ];
}

export default function Home() {
  // Languages are objects w/ name and id properties
  const [searchQuery, setSearchQuery] = useState('');
  const [languages, setLanguages] = useState(undefined);
  const [showCreator, setShowCreator] = useState(false);
  const [dataLoading, startFetch] = useTransition();
  const { email } = useContext(UserContext);
  const colors = ['#FFFFFF', '#C38585', '#C86D6D', '#F9F3E9', '#F5D3BA', '#EDEDE8'];

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
      <Header onSearch={setSearchQuery} />
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
        <div className="languages-container">
          {languages
            .filter(lang =>
              lang.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(lang => {
              const randomColor = colors[Math.floor(Math.random() * colors.length)]; 

              return (
                <div key={lang.id} className="language">
                  <div
                    className="image-placeholder"
                    style={{
                      backgroundImage: `url(${lang.imageUrl || defaultImage})`,
                      backgroundSize: lang.imageUrl ? 'cover' : 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: randomColor,
                    }}
                  />
                  <div className="content">
                    <h3>{lang.name}</h3>
                    <div className="button-container">
                      <Link to={`/language/${lang.id}`}><button className="primary">Learn</button></Link>
                      <Link to={email ? `/language/${lang.id}/edit` : '/login'}><button className="secondary">Edit</button></Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      </main>
      </>
  )
}
