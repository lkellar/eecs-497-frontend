import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAPI } from './util';

export const UserContext = createContext(null);

export default function User({children}) {
    // set to null if not logged in
    const [email, setEmail] = useState(null);
    const fetchMe = async () => {
        const r = await fetchAPI('/auth/me', {
            method: 'GET'
        });
        if (r.ok) {
            const data = await r.json();
            return data.email;
        } 
        return null;
    }
    useEffect(() => {
        async function main() {
            setEmail(await fetchMe());
        }
        main();
    }, [setEmail]);
    return (
        <UserContext.Provider value={{email, setEmail}}>
        {children}
        </UserContext.Provider>
    )
}