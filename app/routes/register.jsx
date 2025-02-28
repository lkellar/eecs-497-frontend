import { API_BASE_URL, PRODUCT_NAME } from '../config';
import { fetchAPI } from '../util'
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../userContext';
import { useContext, useTransition, useState } from 'react';
import '../styles/auth.css';

export function meta() {
  return [
    { title: `${PRODUCT_NAME} Registration` },
    { name: "description", content: `${PRODUCT_NAME} Registration` },
  ];
}

export default function Register() {
  const {setEmail} = useContext(UserContext);
  const [error, setError] = useState('');
  const [registrationPending, startRegistration] = useTransition();
  let navigate = useNavigate();
  
  const handleSubmit = (event) => {
    startRegistration(async () => {
      event.preventDefault();
      
      setError('');
      
      const email = event.target.email.value;
      const password = event.target.password.value;
      const confirm = event.target.confirm.value;
      
      try {
          let response = await fetchAPI('/auth/register', {
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
          // set email to null upon any error
          setEmail(null);
      } catch (e) {
        setError(e.message);
      }
    });
  };
  
  return (
      <main>
      <h1>Register</h1>
      
      <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email"  />
          <label htmlFor="password">Password</label>
          <input type="password" name="password"  />
          <label htmlFor="confirm">Confirm Password</label>
          <input type="password" name="confirm"  />
          
          {error && (
            <p className="error">{error}</p>
          )}
          
          <button className="primary" type="submit" disabled={registrationPending}>Register</button>
          
          <span id="register">Already have an account? <Link to={{pathname: '/login'}}>Log In</Link></span>
      </form>
      </main>
  )
}
