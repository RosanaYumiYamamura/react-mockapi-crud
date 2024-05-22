import { Routes, Route, BrowserRouter} from 'react-router-dom';
import ShowMovies from './components/ShowMovies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowMovies></ShowMovies>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
