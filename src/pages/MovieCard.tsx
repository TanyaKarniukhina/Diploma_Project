import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useParams } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails';
import Recomendations from '../components/Recomendations';
import './styles/MovieCard.css';
import { useTheme } from '../components/Theme';

function MovieCard() {
    const { id } = useParams<{ id: string }>();
    const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className={`card-container ${theme === 'light' ? 'light' : 'dark'}`}>
            <div className='card'>
                <Header />
                <div className={`content ${theme === 'light' ? 'light' : 'dark'}`}>
                    <Menu />
                    <div className='page-details'>
                        {isLoading ? (
                            <div className={`loading ${theme === 'light' ? 'light' : 'dark'}`}>Loading...</div>
                        ) : (
                            <>
                                <MovieDetails setSelectedMovieTitle={setSelectedMovieTitle} />
                                <Recomendations currentMovieId={id || ''} movieTitle={selectedMovieTitle} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
