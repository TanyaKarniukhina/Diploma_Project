import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Movie } from '../types/Movie';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useTheme } from '../components/Theme';
import './styles/Recomendations.css';

function Recomendations({ currentMovieId, movieTitle }: { currentMovieId: string, movieTitle: string }) {
    const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const moviesPerPage = 4;
    const { theme } = useTheme();

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            try {
                const searchQueries = movieTitle.split(' ').slice(0, 3);
                const moviePromises = searchQueries.map(query =>
                    axios.get(`http://www.omdbapi.com/?s=${query}&apikey=e879ef3f`)
                );
                const responses = await Promise.all(moviePromises);
                const allMoviesData = responses.flatMap(response => response.data.Search || []);
                const uniqueMovies = Array.from(new Set(allMoviesData.map(movie => movie.imdbID)))
                    .map(id => allMoviesData.find(movie => movie.imdbID === id))
                    .filter(movie => movie.imdbID !== currentMovieId);

                const detailedMoviePromises = uniqueMovies.map(movie =>
                    axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=e879ef3f`)
                );
                const detailedResponses = await Promise.all(detailedMoviePromises);
                const detailedMovies = detailedResponses.map(response => response.data);

                const validMovies = detailedMovies.filter(movie => movie.Poster !== 'N/A' && movie.BoxOffice !== 'N/A');
                validMovies.sort((a, b) => new Date(b.Released).getTime() - new Date(a.Released).getTime());

                setRecommendedMovies(validMovies);
                setCurrentPage(0);
            } catch (error) {
                console.error('Error fetching recommended movies:', error);
            }
        };

        if (movieTitle) {
            fetchRecommendedMovies();
        }
    }, [currentMovieId, movieTitle]);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(recommendedMovies.length / moviesPerPage) - 1));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    };

    const startIdx = currentPage * moviesPerPage;
    const endIdx = startIdx + moviesPerPage;

    return (
        <div className={`recomendations-container ${theme === 'light' ? 'light' : 'dark'}`}>
            <div className='recomendations'>
                <div className='first-container'>
                    <h1 className={`title ${theme === 'light' ? 'light' : 'dark'}`}>Recommendations</h1>
                    <div className='flip-buttons-container'>
                        <IoIosArrowRoundBack 
                            className={`back-arrow ${theme === 'light' ? 'light' : 'dark'}`} 
                            onClick={handlePrevPage}
                            style={{
                                fontSize: '2rem',
                                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                                opacity: currentPage === 0 ? 0.5 : 1
                            }}
                        />
                        <IoIosArrowRoundForward 
                            className={`forward-arrow ${theme === 'light' ? 'light' : 'dark'}`} 
                            onClick={handleNextPage} 
                            style={{
                                fontSize: '2rem',
                                cursor: currentPage === Math.ceil(recommendedMovies.length / moviesPerPage) - 1 ? 'not-allowed' : 'pointer',
                                opacity: currentPage === Math.ceil(recommendedMovies.length / moviesPerPage) - 1 ? 0.5 : 1
                            }}
                        />
                    </div>
                </div>
                <div className='second-container'>
                {recommendedMovies.slice(startIdx, endIdx).map(movie => (
                        <div className='movie-card-recomendations' key={movie.imdbID}>
                            <Link to={`/card/${movie.imdbID}`} key={movie.imdbID} style={{ textDecoration: 'none' }}>
                                <p className='movie-rating-recomendations__rating'>{movie.imdbRating}</p>   
                                <img className='movie-card-recomendations__poster' src={movie.Poster} alt={movie.Title} />
                                <h3 className={`movie-card-recomendations__title ${theme === 'light' ? 'light' : 'dark'}`}>{movie.Title}</h3>
                                <p className='movie-card-recomendations__genres'>{movie.Genre.split(', ').join(' • ')}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Recomendations;




{/* <Link to={`/card/${movie.imdbID}`} key={movie.imdbID} style={{ textDecoration: 'none' }}>
<p className='movie-rating-recomendations__rating'>{movie.imdbRating}</p>   
<img className='movie-card-recomendations__poster' src={movie.Poster} alt={movie.Title} />
<h3 className={`movie-card-recomendations__title ${theme === 'light' ? 'light' : 'dark'}`}>{movie.Title}</h3>
<p className='movie-card-recomendations__genres'>{movie.Genre.split(', ').join(' • ')}</p>
</Link> */}