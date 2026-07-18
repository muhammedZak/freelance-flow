import { useEffect, useState } from 'react';

import { ThemeContext } from './ThemeContext';

const THEME_STORAGE_KEY = 'freelanceflow-theme';

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'dark') {
    return 'dark';
  }

  return 'light';
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  function changeTheme(newTheme) {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  }

  const themeValue = {
    theme,
    toggleTheme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

export default ThemeProvider;
