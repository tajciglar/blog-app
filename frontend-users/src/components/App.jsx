
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './HomePage';
import Signup from './Singup';
import LogInPage from '../../../shared/components/LogInPage';
import PostPage from './PostPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path="/login" exact element={<LogInPage/>} />
        <Route path="/:id/:slug" element={<PostPage />} />
      </Routes>
    </Router>
  );
};

export default App;
