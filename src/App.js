import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Category from './pages/Category';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import Listing from './pages/Listing';
import CreateLisiting from './pages/CreateLisiting';
import ContactLandlord from './pages/ContactLandlord';
import EditListing from './pages/EditListing';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      {/* <h1>GharDekho.com</h1> */}
      <Routes>
        <Route exact path='/' element={<Explore/>} />
        <Route path='/ForgotPassword' element={<ForgotPassword/>} />
        <Route path='/Offers' element={<Offers/>} />
        <Route path='/category/:categoryName' element={<Category/>}/>
        <Route path='/category/:categoryName/:id' element={<Listing/>} />
        <Route path='/contact/:landlordId' element={<ContactLandlord/>} />
        <Route path='/Profile' element={<PrivateRoute />} >
          <Route path='/Profile' element={<Profile/>} />
        </Route>
        <Route path='/CreateListing' element={<CreateLisiting/>} />
        <Route path='/EditListing/:listingId' element={<EditListing/>} />
        <Route path='/SignIn' element={<SignIn/>} />
        <Route path='/SignUp' element={<SignUp/>} />
      </Routes>

      <Navbar/>

      <ToastContainer />
    </Router>
  );
}

export default App;
