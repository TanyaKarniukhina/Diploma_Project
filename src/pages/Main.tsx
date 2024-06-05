import Header from '../components/Header';
import Menu from '../components/Menu';
import MovieList from '../components/MovieList';
import './styles/Main.css';
import { useTheme } from '../components/Theme';

function Main() {
    const { theme } = useTheme();

    return (
            <div className={`main-container ${theme === 'light' ? 'light' : 'dark'}`}>
                <div className='main'>
                    <Header />
                    <div className={`content ${theme === 'light' ? 'light' : 'dark'}`}>
                        <Menu />
                        <MovieList />
                    </div>
                </div>
            </div>
    )
}

export default Main;
