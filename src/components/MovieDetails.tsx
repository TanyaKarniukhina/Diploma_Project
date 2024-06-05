import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/Movie';
import { FaBookmark } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../redux/MovieSlice';
import { RootState } from '../redux/MovieStore';
import { useAuth } from './User';
import { useTheme } from '../components/Theme';
import './styles/MovieDetails.css';

function MovieDetails({ setSelectedMovieTitle }: { setSelectedMovieTitle: (title: string) => void }) {
    const { id } = useParams<{ id: string }>();
    const { isAuth, id: userId } = useAuth();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.movies.favorites[userId] || []);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=e879ef3f`);
                const movieDetails: Movie = response.data;
                setSelectedMovie(movieDetails);
                setSelectedMovieTitle(movieDetails.Title); 
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };
    
        fetchMovieDetails();
    }, [id, setSelectedMovieTitle]);

    const isMovieInFavorites = () => {
        return favorites.some((movie: Movie) => movie.imdbID === selectedMovie?.imdbID);
    };

    const handleToggleFavorite = () => {
        if (!isAuth) {
            alert('Войдите в аккаунт, чтобы добавить фильм в избранное');
            return;
        }
        if (selectedMovie) {
            if (isMovieInFavorites()) {
                dispatch(removeFromFavorites({ userId, movieId: selectedMovie.imdbID }));
            } else {
                dispatch(addToFavorites({ userId, movie: selectedMovie }));
            }
        }
    };

    return (
        <div className={`details-container ${theme === 'light' ? 'light' : 'dark'}`}>
            {selectedMovie && (
                <div className={`details ${theme === 'light' ? 'light' : 'dark'}`}>
                    <div className='poster-container'>
                        <img className='poster' src={selectedMovie.Poster} alt={selectedMovie.Title} />
                        <div className='reaction-buttons'>
                            <button
                                className='favorites-button'
                                onClick={handleToggleFavorite}
                            >
                                <FaBookmark className='favorites-button__pic' 
                                style={{
                                    color: isMovieInFavorites() ? '#7B61FF' : '#AFB2B6'
                                }}/>
                            </button>
                            <div className='button-separator'></div>
                            <button className='share-button'>
                                <FiShare2 className='share-button__pic' />
                            </button>
                        </div>
                    </div>
                    <div className='movie-info'>
                        <p className='movie-info__genres'>{selectedMovie.Genre.split(', ').join(' • ')}</p>
                        <h2 className={`movie-info__title ${theme === 'light' ? 'light' : 'dark'}`}>{selectedMovie.Title}</h2>
                        <div className='movie-info-box'>
                            <p className='movie-info-box__rating'>{selectedMovie.imdbRating}</p>
                            <p className='movie-info-box__runtime'>{selectedMovie.Runtime}</p>
                        </div>
                        <p className={`movie-info__plot ${theme === 'light' ? 'light' : 'dark'}`}>{selectedMovie.Plot}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Year</span>{selectedMovie.Year}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Released</span>{selectedMovie.Released}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Box Office</span>{selectedMovie.BoxOffice}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Country</span>{selectedMovie.Country}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Production</span>{selectedMovie.Production}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Actors</span>{selectedMovie.Actors}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Director</span>{selectedMovie.Director}</p>
                        <p className={`movie-info__details ${theme === 'light' ? 'light' : 'dark'}`}><span className='caption'>Writers</span>{selectedMovie.Writer}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;
