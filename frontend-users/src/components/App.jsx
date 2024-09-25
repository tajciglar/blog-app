
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogInPage from 'shared/components/LogInPage';
import HomePage from './HomePage';
import Signup from './Singup';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path="/login" exact element={<LogInPage/>} />
        <Route path='/' element={<HomePage/>} />
      </Routes>
    </Router>
  );
};

export default App;
