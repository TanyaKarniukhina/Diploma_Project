import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillFire } from "react-icons/ai";
import { Movie } from '../types/Movie';
import './styles/TrendsList.css';
import { useTheme } from '../components/Theme';

const TrendsList = () => {
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const API_KEY = 'e879ef3f';
    const popularKeywords = ['Dune', 'Poor Things', 'Barbie', 'Oppenheimer', 'Challengers', 'Abigail', 'Fall guy', 'Spider-Man', 'Wonka', 'The Super Mario'];
    const { theme } = useTheme();

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            setLoading(true);
            let fetchedMovies: Movie[] = [];

            try {
                for (let keyword of popularKeywords) {
                    if (fetchedMovies.length >= 10) break; 

                    const MOVIE_QUERY = `http://www.omdbapi.com/?s=${keyword}&apikey=${API_KEY}`;
                    const response = await axios.get(MOVIE_QUERY);
                    let movies = response.data.Search || [];

                    const movieDetailsPromises = movies.map((movie: Movie) => axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`));
                    const moviesDetailsResponses = await Promise.all(movieDetailsPromises);
                    const moviesWithDetails = moviesDetailsResponses.map(response => response.data);

                    const filteredMovies = moviesWithDetails.filter(movie => {
                        const hasValidBoxOffice = movie.BoxOffice !== 'N/A';
                        const isRecentYear = movie.Year === '2023' || movie.Year === '2024';
                        return hasValidBoxOffice && isRecentYear;
                    });

                    fetchedMovies = [...fetchedMovies, ...filteredMovies].slice(0, 10); 
                }

                fetchedMovies.sort((a, b) => new Date(b.Released).getTime() - new Date(a.Released).getTime());

                setTrendingMovies(fetchedMovies.slice(0, 10));
            } catch (error) {
                console.error('Error fetching trending movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingMovies();
    }, []);

    return (
        <div className={`trends-list-container ${theme === 'light' ? 'light' : 'dark'}`}>
            {loading ? (
                <h2 className={`loading ${theme === 'light' ? 'light' : 'dark'}`}>Loading...</h2>
            ) : (
                <div className={`trends-list ${theme === 'light' ? 'light' : 'dark'}`}>
                    {trendingMovies.map(movie => (
                        <Link to={`/card/${movie.imdbID}`} key={movie.imdbID} className='trends-movie-card'>
                            {movie.imdbRating && <p className='trends-movie-rating'><AiFillFire className='trends-page__pic'/>&nbsp;{movie.imdbRating}</p>}
                            {movie.Poster && <img className='trends-movie-poster' src={movie.Poster} alt={movie.Title} />}
                            <h3 className={`trends-movie-title ${theme === 'light' ? 'light' : 'dark'}`}>{movie.Title}</h3>
                            {movie.Genre && <p className='trends-movie-genres'>{movie.Genre.split(', ').join(' • ')}</p>}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrendsList;
