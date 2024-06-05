import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie } from '../types/Movie';

interface FavoritesState {
    [userId: string]: Movie[];
}

const loadFavoritesFromLocalStorage = (): FavoritesState => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : {};
};

export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async (page: number) => {
        try {
            const response = await axios.get(`http://www.omdbapi.com/?s=movie&page=${page}&apikey=e879ef3f`);
            const moviesData: Movie[] = response.data.Search;
            if (!moviesData || moviesData.length === 0) {
                throw new Error('Ошибка: Нет доступных фильмов.');
            }
            const randomMovies: Movie[] = [];
            const genreRequests = []; 

            const fetchMovieDetails = async (imdbID: string) => {
                const response = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=e879ef3f`);
                return response.data;
            };

            while (randomMovies.length < 10) {
                const randomIndex = Math.floor(Math.random() * moviesData.length);
                const randomMovie = moviesData[randomIndex];
                if (!randomMovies.some(movie => movie.imdbID === randomMovie.imdbID)) {
                    randomMovies.push(randomMovie);
                    genreRequests.push(fetchMovieDetails(randomMovie.imdbID));
                }
            }
            const genresResponses = await Promise.all(genreRequests);
            randomMovies.forEach((movie, index) => {
                const genresString = genresResponses[index].Genre.split(', ').join(' • ');
                const imdbRating = genresResponses[index].imdbRating;
                movie.Genre = genresString;
                movie.imdbRating = imdbRating;
            });

            return randomMovies;
        } catch (error) {
            throw error;
        }
    }
);

export const searchMovies = createAsyncThunk(
    'movies/searchMovies',
    async function (text: string, { rejectWithValue }) {
        try {
            const response = await fetch(`https://omdbapi.com/?s=${text}&apikey=e879ef3f`);
            if (!response.ok) {
                throw new Error('Фильм не найден');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw  rejectWithValue(( error as Error).message);
        }
    }
);

const movieSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [] as Movie[],
        loading: false,
        error: null as string | null,
        searchResult: [] as Movie[] | null,
        favorites: loadFavoritesFromLocalStorage(), 
    },
    reducers: {
        addToFavorites: (state, action: PayloadAction<{ userId: string; movie: Movie }>) => {
            const { userId, movie } = action.payload;
            if (!state.favorites[userId]) {
                state.favorites[userId] = []; 
            }
            state.favorites[userId].push(movie);

            localStorage.setItem('favorites', JSON.stringify(state.favorites));
        },
        removeFromFavorites: (state, action: PayloadAction<{ userId: string; movieId: string }>) => {
            const { userId, movieId } = action.payload;
            state.favorites[userId] = state.favorites[userId].filter(movie => movie.imdbID !== movieId);

            localStorage.setItem('favorites', JSON.stringify(state.favorites));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null; 
            })
            .addCase(searchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResult = action.payload; 
            })
            .addCase(searchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null; 
            });
    }
});

export const { addToFavorites, removeFromFavorites } = movieSlice.actions;
export default movieSlice.reducer;
