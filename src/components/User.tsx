import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/User.css';
import { FiUser } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../redux/UserSlice';
import { setUser } from '../redux/UserSlice';
import { useTheme } from '../components/Theme';
import { RiHome6Fill } from "react-icons/ri";
import { AiFillFire } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import { CiMenuBurger } from "react-icons/ci";

export function useAuth() {
    const { email, token, id } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const { email, token, id } = JSON.parse(storedUserData);
            dispatch(setUser({ email, token, id }));
        }
    }, [dispatch]); 

    useEffect(() => {
        if (email && token && id) {
            localStorage.setItem('user', JSON.stringify({ email, token, id }));
        }
    }, [email, token, id]); 

    return {
        isAuth: !!email,
        email,
        token,
        id,
    };
}

function User() {
    const { isAuth, email, token, id } = useAuth(); 
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, [email]); 

    useEffect(() => {
        if (!isAuth) {
            setUserName(null);
        }
    }, [isAuth]);

    const toggleDropDown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        dispatch(removeUser());
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        navigate('/');
    };

    useEffect(() => {
        if (isAuth) {
            localStorage.setItem('user', JSON.stringify({ email, token, id }));
        }
    }, [isAuth]);

    const handleToggleTheme = () => {
        toggleTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className='user-container'>
            {isMobile ? (
                <button className={'burger-icon'} onClick={toggleDropDown}>
                    {isOpen ? <CiMenuBurger className='burger-icon__pic'/> : <CiMenuBurger className='burger-icon__pic'/>}
                </button>
            ) : (
                <div className='user-info'>
                    {isAuth ? (
                        <>
                            <div className='authenticated-user'>
                                <div className='authenticated-user-initials'>
                                    <h1 className='user-initials'>{userName ? userName.split(' ').map(word => word.charAt(0).toUpperCase()).join('') : ''}</h1>
                                </div>
                                <h5 className={`username ${theme === 'light' ? 'light' : 'dark'}`}>{userName}</h5>
                            </div>
                            <div className='drop-down-container'>
                                <button className={`drop-down-list ${theme === 'light' ? 'light' : 'dark'}`} onClick={toggleDropDown}>
                                    {isOpen ? <IoIosArrowDown className={`drop-down-button-open ${theme === 'light' ? 'light' : 'dark'}`}/> : <IoIosArrowForward className={`drop-down-button ${theme === 'light' ? 'light' : 'dark'}`}/>}
                                </button>
                                {isOpen && (
                                    <div className='drop-down-options-list'>
                                        <div className='drop-down-options'>
                                            <Link to="/reset-password" style={{ textDecoration: 'none' }}>
                                                <button className='drop-down-option'>Reset Password</button>
                                            </Link>
                                            <div className='option-separator'></div>
                                            <button className='drop-down-option' onClick={handleLogout}>Log Out</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='non-authenticated-user'>
                                <div className='non-authenticated-user-icon'>
                                    <FiUser className='non-authenticated-user-icon__pic'/>
                                </div>
                                <h5 className={`non-authenticated-user-text ${theme === 'light' ? 'light' : 'dark'}`}>Sign In</h5>
                            </div>
                            <div className='drop-down-container'>
                                <button className={`drop-down-list ${theme === 'light' ? 'light' : 'dark'}`} onClick={toggleDropDown}>
                                    {isOpen ? <IoIosArrowDown className={`drop-down-button-open ${theme === 'light' ? 'light' : 'dark'}`}/> : <IoIosArrowForward className={`drop-down-button ${theme === 'light' ? 'light' : 'dark'}`}/>}
                                </button>
                                {isOpen && (
                                    <div className='drop-down-options-list'>
                                        <div className='drop-down-options'>
                                            <Link to="/sign-in-page" style={{ textDecoration: 'none' }}>
                                                <button className='drop-down-option'>Sign In</button>
                                            </Link>
                                            <Link to="/sign-up-page" style={{ textDecoration: 'none' }}>
                                                <button className='drop-down-option'>Sign Up</button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
            {isMobile && isOpen && (
                <div className='drop-down-options-list-mobile'>
                    {isAuth ? (
                        <div className='drop-down-mobile-options'>
                            <Link to="/reset-password" style={{ textDecoration: 'none' }}>
                                <button className='drop-down-mobile-option'>Reset Password</button>
                            </Link>
                            <button className='drop-down-mobile-option' onClick={handleLogout}>Log Out</button>
                            <div className='option-mobile-separator'></div>
                        </div>
                    ) : (
                        <div className='drop-down-mobile-options'>
                            <Link to="/sign-in-page" style={{ textDecoration: 'none' }}>
                                <button className='drop-down-mobile-option'>Sign In</button>
                            </Link>
                            <Link to="/sign-up-page" style={{ textDecoration: 'none' }}>
                                <button className='drop-down-mobile-option'>Sign Up</button>
                            </Link>
                            <div className='option-mobile-separator'></div>
                        </div>
                    )}
                    <div className='menu-mobile'>
                        <div className='menu-mobile-container'>
                            <div className='menu-options'>
                                <div className={`menu-option ${location.pathname === "/" ? 'active' : ''}`}>
                                    <div className='menu-option-icon'>
                                        <RiHome6Fill className='menu-option-icon__pic'/>
                                    </div>
                                    <Link to="/" style={{ textDecoration: 'none' }}>
                                        <h1 className='menu-option__text'>Home</h1>
                                    </Link>
                                </div>
                                <div className={`menu-option ${location.pathname === "/trends" ? 'active' : ''}`}>
                                    <div className='menu-option-icon'>
                                        <AiFillFire className='menu-option-icon__pic'/>
                                    </div>
                                    <Link to="/trends" style={{ textDecoration: 'none' }}>
                                        <h1 className='menu-option__text'>Trends</h1>
                                    </Link>
                                </div>
                                <div className={`menu-option ${location.pathname === "/favorites" ? 'active' : ''}`}>
                                    <div className='menu-option-icon'>
                                        <FaBookmark className='menu-option-icon__pic'/>
                                    </div>
                                    <Link to="/favorites" style={{ textDecoration: 'none' }}>
                                        <h1 className='menu-option__text'>Favorites</h1>
                                    </Link>
                                </div>
                                <div className='menu-option'>
                                    <button type='button' className={`theme-button ${theme === 'dark' ? 'active' : ''}`} onClick={handleToggleTheme}>
                                        <IoSunny className='sun-icon' />
                                        <FaMoon className='moon-icon' />
                                    </button>
                                </div>
                            </div>
                            <h1 className='menu-mobile-all-rights-reserved'>© All Rights Reserved</h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default User;

