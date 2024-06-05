import TrendsList from '../components/TrendsList';
import Header from '../components/Header';
import Menu from '../components/Menu';
import './styles/Trends.css';

function Trends() {
    return (
        <div className='main-container'>
            <div className="main">
                <Header />
                <div className='content'>
                    <Menu />
                    <TrendsList />
                </div>
            </div>
        </div>
    )
}

export default Trends;