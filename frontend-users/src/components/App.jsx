
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from 'shared/components/LandingPage';
import Dashboard from './Dashboard';
import Signup from './Singup';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LandingPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/signup' element={<Signup/>} />
      </Routes>
    </Router>
  );
};

export default App;
