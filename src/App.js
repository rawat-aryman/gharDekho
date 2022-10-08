import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      {/* <h1>GharDekho.com</h1> */}
      <Routes>
        <Route exact path='/' element={<Explore/>} />
        <Route path='/ForgotPassword' element={<ForgotPassword/>} />
        <Route path='/Offers' element={<Offers/>} />
        <Route path='/Profile' element={<Profile/>} />
        <Route path='/SignIn' element={<SignIn/>} />
        <Route path='/SignUp  ' element={<SignUp/>} />
      </Routes>
    </Router>
  );
}

export default App;
