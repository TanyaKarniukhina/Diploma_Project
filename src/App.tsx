import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; 
import store from './redux/MovieStore'; 
import Main from './pages/Main';
import MovieCard from './pages/MovieCard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import SearchPage from './pages/SearchPage';
import Favorites from './pages/Favorites';
import Trends from './pages/Trends';
import './App.css';
import { ThemeProvider } from './components/Theme';

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/card/:id" element={<MovieCard />} />
              <Route path="/sign-in-page" element={<SignIn />} />
              <Route path="/sign-up-page" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/trends" element={<Trends />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
