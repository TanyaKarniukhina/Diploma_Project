import FavoritesList from '../components/FavoritesList';
import Header from '../components/Header';
import Menu from '../components/Menu';
import './styles/Favorites.css';

function Favorites() {
    return (
        <div className='main-container'>
            <div className="main">
                <Header />
                <div className='content'>
                    <Menu />
                    <FavoritesList />
                </div>
            </div>
        </div>
    )
}

export default Favorites;