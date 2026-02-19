import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RealTimePage from './pages/RealTimePage';
import HistoricalPage from './pages/HistoricalPage';
import ForecastPage from './pages/ForecastPage';
import AutocompletePage from './pages/AutocompletePage';
import MarinePage from './pages/MarinePage';

function App() {
  return (
    <BrowserRouter>
      <div className="app" id="app-root">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<RealTimePage />} />
            <Route path="/historical" element={<HistoricalPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/autocomplete" element={<AutocompletePage />} />
            <Route path="/marine" element={<MarinePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
