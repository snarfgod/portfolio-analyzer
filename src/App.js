import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import PortfolioValueChart from './components/PortfolioValueCharts';

function App() {
  return (
    <div className="App">
      <Navigation />
      <PortfolioValueChart />
    </div>
  );
}

export default App;
