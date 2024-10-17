import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Signup from './Singup';
import LogInPage from './LogInPage';
import PostPage from './PostPage';
import ProtectedRoute from './ProtectedRoute';
import NewPost from './NewPost';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/:id/:slug" element={<PostPage />} />

        {/* Admin Routes */}
        <Route path='/admin'
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <HomePage isAdmin={true} /> 
                </ProtectedRoute>
              } 
            />
        <Route path="/admin/:id/:slug" element={
          <ProtectedRoute allowedRole="ADMIN">
            <PostPage isAdmin={true} />
          </ProtectedRoute>
        } />
        <Route path='/admin/newPost'
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <NewPost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
