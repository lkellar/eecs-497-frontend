import { PRODUCT_NAME } from '../config'
import { UserContext } from '../userContext';
import { useContext, useTransition } from 'react';
import { Link } from 'react-router';
import { fetchAPI } from '../util';
import '../styles/header.css';
import Logo from '../../public/logo.png';

export default function Header({onSearch}) {
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
      <Link to="/" className="product-link">
        <img src={Logo} alt="Logo" className="logo" />
        {PRODUCT_NAME}
      </Link>
      <input
        type="text"
        placeholder="  Search a language..."
        className="search-bar"
        onChange={(e) => onSearch(e.target.value)}
      />
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