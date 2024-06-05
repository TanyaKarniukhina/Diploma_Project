import './styles/Menu.css';
import { RiHome6Fill } from "react-icons/ri";
import { AiFillFire } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { useTheme } from './Theme';
import { useLocation } from 'react-router-dom';

const Menu = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const handleToggleTheme = () => {
        toggleTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className='menu'>
            <div className={`menu-container ${theme === 'light' ? 'light' : 'dark'}`}>
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
                <h1 className='menu-all-rights-reserved'>© All Rights Reserved</h1>
            </div>
        </div>
    );
}


export default Menu;
