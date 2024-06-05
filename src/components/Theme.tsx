import { createContext, useState, useEffect, useContext } from 'react';
import { ITheme, IThemeType } from '../types/Theme';

const ThemeContext = createContext<IThemeType>({
    theme: 'dark',
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const [theme, setTheme] = useState<ITheme>(savedTheme as ITheme);

    const toggleTheme = (selectedTheme: ITheme) => {
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

