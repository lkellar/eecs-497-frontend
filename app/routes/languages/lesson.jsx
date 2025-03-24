import { fetchAPI, mod } from '../../util';
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../../userContext';
import { useEffect, useState, useTransition, useMemo, useContext } from 'react';
import Header from '../../components/header';
import Flashcard from '../../components/flashcard';
import '../../styles/language/learn.css';

export function meta() {
  return [
    { title: `Learn Language Lesson` },
  ];
}

const LINK_REGEX = /!\[.*\]\(.*\)/g;
const CAPTURING_LINK_REGEX = /!\[(.*)\]\((.*)\)/g;

export default function LanguageLesson({params}) {
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const { email } = useContext(UserContext);
    
    useEffect(() => {
        async function main() {
            setError('');
            try {
                const r = await fetchAPI(`/lang/${params.lang_id}/lesson/${params.lesson_id}`, {method: 'GET'});
                const data = await r.json();
                if (!r.ok) {
                    setError(data.error)
                } else {
                    setData(data);
                }
            } catch (e) {
                setError(e.message);
            }
        }
        main();
    }, []);
    
    // replace markdown links with real links
    const elements = useMemo(() => {
        if (!data?.text) {
            return '';
        }
        const matches = data.text.matchAll(CAPTURING_LINK_REGEX);
        let links = [];
        for (const match of matches) {
            const alt = match[1];
            const url = encodeURI(match[2]);
            links.push([alt, url])
        }
        const splits = data.text.split(LINK_REGEX);
        let eles = [];
        var index = 0;
        for (const split of splits) {
            eles.push(<p>{split}</p>);
            if (index + 1 < splits.length) {
                eles.push(<img width="80%" alt={links[index][0]} src={links[index][1]} />);
            }
            index += 1;
        }
        return eles;
    }, [data?.text]);
    
    return (
        <>
        <Header />
        <main>
            <div className="title">
              <Link to={email ? `/language/${params.lang_id}/lesson/${params.lesson_id}/edit` : '/login'}><button className="secondary">Edit</button></Link>
                <h1>{data ? `${data.title}`: 'Lesson'}</h1>
                <Link to={`/language/${params.lang_id}`}><button className="secondary">Back</button></Link>
            </div>
            <div className="content">
                {data == null && (
                    <p>Loading...</p>
                )}
                {error && (
                    <p className="error">{error}</p>
                )}
                {data != null && elements.length == 0 && (
                    <p>No lesson text</p>
                )}
                {elements?.length > 0 && elements}
            </div>
        </main>
        </>
    )
}
