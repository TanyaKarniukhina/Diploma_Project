import './styles/Header.css';
import { useState } from 'react';
import User from './User';
import logo from '../image/pixema.svg';
import darkLogo from '../image/pixema-dark.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchMovies } from '../redux/MovieSlice';
import { useTheme } from '../components/Theme';

function Header() {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch()<any>;
    const { theme } = useTheme();

    const handleSearch = (event: any) => {
        setSearchText(event.target.value);
    };

    const clickEnter = (event: any) => {
        setSearchText(event.target.value);
        if (event.key === 'Enter') {
            navigate("/search")
            dispatch(searchMovies(searchText))
        }
    };

    return (
        <>
            <div className={`header ${theme === 'light' ? 'light' : 'dark'}`}>
                <div className={`header-container ${theme === 'light' ? 'light' : 'dark'}`}>
                    <div className={`header-container-logo ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <img className='header-container-logo__pic' src={theme === 'dark' ? logo : darkLogo} alt='logo' />
                    </div>
                    <div className='header-container-search'>
                        <input
                            className={`search-input ${theme === 'dark' ? 'dark' : 'light'}`}
                            type="text"
                            value={searchText}
                            onChange={handleSearch}
                            onKeyDown={clickEnter}
                            placeholder="Поиск..."
                        />
                    </div>
                    <div className={`header-container-user ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <User />
                    </div>
                </div>

                <div className={`header-container-mobile ${theme === 'light' ? 'light' : 'dark'}`}>
                    <div className={`header-container-mobile-top ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <div className={`header-container-logo ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <img className='header-container-logo__pic' src={theme === 'dark' ? logo : darkLogo} alt='logo' />
                        </div>
                        <div className={`header-container-user ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <User />
                        </div>
                    </div>
                    <div className='header-container-mobile-search'>
                        <input
                            className={`search-input ${theme === 'dark' ? 'dark' : 'light'}`}
                            type="text"
                            value={searchText}
                            onChange={handleSearch}
                            onKeyDown={clickEnter}
                            placeholder="Поиск..."
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
