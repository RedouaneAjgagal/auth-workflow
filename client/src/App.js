import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  Home,
  Error,
  Register,
  Login,
  Verify,
  Dashboard,
  ProtectedRoute,
  ForgotPassword,
  ResetPassword,
} from './pages';
import Navbar from './components/Navbar';
import { useGlobalContext } from './context';
function App() {
  const { isLoading } = useGlobalContext();
  if (isLoading) {
    return (
      <section className='page page-center'>
        <div className='loading'></div>
      </section>
    );
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<ProtectedRoute dashboard={<Dashboard />} />} />
        {/* <ProtectedRoute path='/dashboard' /> */}
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/user/verify-email' element={<Verify />} />
        <Route path='/user/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
