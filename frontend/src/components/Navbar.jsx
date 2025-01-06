import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <nav>
      <Link to="/">{t('welcome')}</Link>
      <Link to="/login">{t('login')}</Link>
      <Link to="/register">Register</Link>
      <Link to="/vote">{t('vote')}</Link>
      <Link to="/results">{t('results')}</Link>
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('si')}>SI</button>
      <button onClick={() => changeLanguage('ta')}>TA</button>
    </nav>
  );
};

export default Navbar;
