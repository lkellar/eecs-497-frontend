import { API_BASE_URL, PRODUCT_NAME } from '../config';
import { fetchAPI } from '../util'
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../userContext';
import { useContext, useTransition, useState } from 'react';
import '../styles/auth.css';

export function meta() {
  return [
    { title: `${PRODUCT_NAME} Login` },
    { name: "description", content: `${PRODUCT_NAME} Login` },
  ];
}

export default function Login() {
  const {setEmail} = useContext(UserContext);
  const [error, setError] = useState('');
  const [loginPending, startLogin] = useTransition();
  let navigate = useNavigate();
  
  const handleSubmit = (event) => {
    startLogin(async () => {
      event.preventDefault();
      
      setError('');
      
      const email = event.target.email.value;
      const password = event.target.password.value;
      
      try {
          let response = await fetchAPI('/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
          });
          
          if (response.ok) {
            setEmail(email);
            navigate('/');
          }
          await response.json()
            .then(d => setError(d.error));
            
          // set email to null on invalid attempts
          setEmail(null);
      } catch (e) {
        setError(e.message);
      }
    });
  };
  
  return (
      <main>
      <h1>Log In</h1>
      
      <form method="post" onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email"  />
          <label htmlFor="password">Password</label>
          <input type="password" name="password"  />
          
          {error && (
            <p className="error">{error}</p>
          )}
          
          <button className="primary" type="submit" disabled={loginPending}>Log In</button>
          
          <span id="register">Don't have an account? <Link to={{pathname: '/register'}}>Register</Link></span>
      </form>
      </main>
  )
}
