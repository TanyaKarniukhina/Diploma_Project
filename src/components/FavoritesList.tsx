import { useSelector } from 'react-redux';
import { RootState } from '../redux/MovieStore';
import { removeFromFavorites } from '../redux/MovieSlice';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './User';
import { Movie } from '../types/Movie'; 
import { FaBookmark } from 'react-icons/fa';
import './styles/FavoritesList.css';
import { useTheme } from '../components/Theme';

function FavoritesList() {
    const { isAuth, id: userId } = useAuth();
    const dispatch = useDispatch();
    const favoriteMovies = useSelector((state: RootState) => state.movies.favorites[userId] || []); 
    const { theme } = useTheme();

    const handleRemoveFromFavorites = (movieId: string) => {
        dispatch(removeFromFavorites({ userId, movieId }));
    };

    if (!isAuth) {
        return <p className={`sign-up-favorites ${theme === 'light' ? 'light' : 'dark'}`}>Please sign in to view your favorites.</p>;
    }

    return (
        <div className={`favorites-list-container ${theme === 'light' ? 'light' : 'dark'}`}>
            {Array.isArray(favoriteMovies) && favoriteMovies.length > 0 ? ( 
                <div className={`favorites-list ${theme === 'light' ? 'light' : 'dark'}`}>
                    {favoriteMovies.map((movie: Movie) => ( 
                        <div className='favorite-movie' key={movie.imdbID}>
                            <Link to={`/card/${movie.imdbID}`} className='movie-favorite-card' style={{ textDecoration: 'none' }}>
                                {movie.imdbRating && <p className='movie-favorite-rating'>{movie.imdbRating}</p>}
                                {movie.Poster && <img className='movie-favorite-poster' src={movie.Poster} alt={movie.Title} />}
                                <h3 className={`movie-favorite-title ${theme === 'light' ? 'light' : 'dark'}`}>{movie.Title}</h3>
                                {movie.Genre && <p className='movie-favorite-genres'>{movie.Genre.split(', ').join(' • ')}</p>}
                            </Link>
                            <button className='favorites-page-button' onClick={() => handleRemoveFromFavorites(movie.imdbID)}><FaBookmark className='favorites-page-button__pic' /></button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={`empty-favorites ${theme === 'light' ? 'light' : 'dark'}`}>Your favorites list is empty.</p>
            )}
        </div>
    );
}

export default FavoritesList;