import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.js';
import ProductScreen from './screens/ProductScreen.js';

function App() {

  return (

    <BrowserRouter>
      <div>
        <header>
          <Link to='/'>Amazona</Link>
        </header>
        <main>
          <Routes>
            <Route path='/product/:slug' element={<ProductScreen />} />
            <Route path='/' element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
