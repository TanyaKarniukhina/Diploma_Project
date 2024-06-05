import { useSelector } from 'react-redux';
import './styles/SearchPage.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/Movie';
import axios from 'axios';
import { useTheme } from '../components/Theme';

function SearchPage() {
    const { searchResult } = useSelector((state: any) => state.movies);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const API_KEY = 'e879ef3f';
    const { theme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (searchResult && searchResult.Search) {
                const movieDetailsPromises = searchResult.Search.map((movie: Movie) =>
                    axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
                );

                const moviesDetailsResponses = await Promise.all(movieDetailsPromises);
                const moviesWithDetails = moviesDetailsResponses.map(response => response.data);

                const filteredMovies = moviesWithDetails.filter(movie => {
                    const hasValidBoxOffice = movie.BoxOffice !== 'N/A';
                    const hasPoster = movie.Poster !== 'N/A';
                    return hasValidBoxOffice && hasPoster;
                });

                filteredMovies.sort((a, b) => new Date(b.Released).getTime() - new Date(a.Released).getTime());

                setFilteredMovies(filteredMovies);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [searchResult]);

    return (
        <div className={`search-container ${theme === 'light' ? 'light' : 'dark'}`}>
            <div className='search'>
                <Header />
                <div className='content'>
                    <Menu />
                    <div className='page-details'>
                        {isLoading ? (
                            <div className={`loading ${theme === 'light' ? 'light' : 'dark'}`}>Loading...</div>
                        ) : (
                            <>
                                {filteredMovies.length > 0 ? (
                                    <div className={`search-results-container ${theme === 'light' ? 'light' : 'dark'}`}>
                                        {filteredMovies.map((movie: Movie) => (
                                            <Link to={`/card/${movie.imdbID}`} key={movie.imdbID} className='movie-card'>
                                                {movie.imdbRating && <p className='movie-rating'>{movie.imdbRating}</p>}
                                                {movie.Poster && <img className='movie-poster' src={movie.Poster} alt={movie.Title} />}
                                                <h3 className={`movie-title ${theme === 'light' ? 'light' : 'dark'}`}>{movie.Title}</h3>
                                                {movie.Genre && <p className='movie-genres'>{movie.Genre}</p>}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={`not-found ${theme === 'light' ? 'light' : 'dark'}`}>Movie not found</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
