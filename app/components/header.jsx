import { PRODUCT_NAME } from '../config'
import { UserContext } from '../userContext';
import { useContext, useTransition } from 'react';
import { Link } from 'react-router';
import { fetchAPI } from '../util';
import '../styles/header.css';

export default function Header() {
  const { email, setEmail } = useContext(UserContext);
  const [logoutPending, startLogout] = useTransition();
  
  const handleLogout = () => {
    startLogout(async () => {
      await fetchAPI('/auth/logout', {
        method: 'POST'
      });
      setEmail(null);
    });
  };

  return (
      <div className="header">
      <Link to="/">{PRODUCT_NAME}</Link>
      {email && (
        <div>
        <button className="secondary" onClick={handleLogout}>Log Out</button>
        </div>
      )}
      {!email && (
        <div>
          <Link to="/login"><button className="primary">Log In</button></Link>
          <Link to="/register"><button className="secondary">Register</button></Link>
        </div>
      )}
      </div>
  )   
}