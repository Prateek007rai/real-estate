import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "./Pages/Home";
import Login from './Pages/Login';
import Register from './Pages/Register';
import { AuthProvider } from './context/auth';
import Main from './components/nav/Main';
import {Toaster} from 'react-hot-toast';
import AccountActivate from './Pages/auth/AccountActivate';
import ForgotPassword from './Pages/auth/ForgotPassword';
import AccessAccount from './Pages/auth/AccessAccount';
import Dashboard from './Pages/user/Dashboard';
import AdCreate from './Pages/user/ad/AdCreate';
import PrivateRoute from './components/routes/PrivateRoute';
import SellHouse from './Pages/user/ad/SellHouse';
import SellLand from './Pages/user/ad/SellLand';
import RentHouse from './Pages/user/ad/RentHouse';
import RentLand from './Pages/user/ad/RentLand';
import AdView from './Pages/AdView';
import Footer from './components/nav/Footer';
import Profile from './Pages/user/Profile';
import Settings from './Pages/user/Settings';
import AdEdit from './Pages/user/ad/AdEdit';
import Wishlist from './Pages/user/Wishlist';
import Enquiries from './Pages/user/Enquiries';
import Agents from './Pages/Agents';
import Agent from './Pages/Agent';
import Buy from './Pages/Buy';
import Rent from './Pages/Rent';
import { SearchProvider } from './context/Search';
import Search from './Pages/Search';

const PageNotFound = () =>(
   <div className='text-center p-5'>
    <h2>Page Not Found 404</h2>
   </div>
)

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <SearchProvider>
            <Main />
            <Toaster />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/auth/account-activate/:token' element={<AccountActivate />} />
              <Route path='/auth/forgot-password' element={<ForgotPassword />} />
              <Route path='/auth/access-account/:token' element={<AccessAccount />} />

              <Route path="/" element={<PrivateRoute />}>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='user/wishlist' element={<Wishlist />} />
                <Route path='user/enquiries' element={<Enquiries />} />
                <Route path='ad/create' element={<AdCreate />} />
                <Route path='ad/create/sell/House' element={<SellHouse />} />
                <Route path='ad/create/sell/Land' element={<SellLand />} />
                <Route path='ad/create/rent/House' element={<RentHouse />} />
                <Route path='ad/create/rent/Land' element={<RentLand />} />
                <Route path='user/profile' element={<Profile />} />
                <Route path='user/settings' element={<Settings />} />
                <Route path='user/ad/:slug' element={<AdEdit />} />
              </Route>
              
              <Route path='/ad/:slug' element={<AdView />} />
              <Route path='/agents' element={<Agents />} />
              <Route path='/agent/:username' element={<Agent />} />

              <Route path='/buy' element={<Buy />} />
              <Route path='/rent' element={<Rent />} />

              <Route path='/search' element={<Search />} />     

              <Route path='*' element={<PageNotFound />} />           

            </Routes>
            <Footer />
          </SearchProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
