import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/MovieSlice';
import { RootState } from '../redux/MovieStore';
import { Movie } from '../types/Movie';
import './styles/MovieList.css'; 
import { useTheme } from '../components/Theme';

function MovieList() {
    const dispatch = useDispatch();
    const { movies, loading, error } = useSelector((state: RootState) => state.movies);
    const [page, setPage] = useState(1);
    const [loadedMovies, setLoadedMovies] = useState<Movie[]>([]); 
    const { theme } = useTheme();

    useEffect(() => {
        dispatch(fetchMovies(page) as any);
    }, [dispatch, page]);

    useEffect(() => {
        if (movies && movies.length > 0) {
            setLoadedMovies((prevMovies) => [...prevMovies, ...movies]); 
        }
    }, [movies]);

    const handleShowMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const uniqueMovies = loadedMovies.filter((movie, index, self) =>
        index === self.findIndex((m) => (
            m.imdbID === movie.imdbID
        ))
    );

    return (
        <div className={`movie-list-container ${theme === 'light' ? 'light' : 'dark'}`}>
            {loading && loadedMovies.length === 0 ? (
                <h2 className={`loading ${theme === 'light' ? 'light' : 'dark'}`}>Loading...</h2>
            ) : error ? (
                <h2 className='error'>{error}</h2>
            ) : ( 
                <>
                    {uniqueMovies.length > 0 ? (
                        <div className={`movie-list ${theme === 'light' ? 'light' : 'dark'}`}>
                            {uniqueMovies.map((movie: Movie) => (
                                <Link to={`/card/${movie.imdbID}`} key={movie.imdbID} className='movie-card'>
                                    {movie.imdbRating && <p className='movie-rating'>{movie.imdbRating}</p>}
                                    {movie.Poster && <img className='movie-poster' src={movie.Poster} alt={movie.Title} />}
                                    <h3 className={`movie-title ${theme === 'light' ? 'light' : 'dark'}`}>{movie.Title}</h3>
                                    {movie.Genre && <p className='movie-genres'>{movie.Genre}</p>}
                                </Link>
                            ))}
                        </div>
                    ) : ( 
                        <p>No movies found.</p>
                    )}
                    {!loading && (
                        <div className={`show-more-container ${theme === 'light' ? 'light' : 'dark'}`}>
                            <button onClick={handleShowMore} className='show-more-button'>Show more</button>
                        </div>      
                    )}
                </>
            )}
        </div>
    );
}

export default MovieList;
