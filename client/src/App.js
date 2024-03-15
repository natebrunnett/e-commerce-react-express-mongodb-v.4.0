import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import URL from './components/config'
import LandingPage from './views/LandingPage'
import Navbar from './components/Navbar';
import Menu from './views/Menu'
import Cart from './views/Cart'
import Login from './views/Login'
import Register from './views/Register'
import * as jose from 'jose'

//stripe
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import PaymentSuccess from "./stripe/payment_success";
import PaymentError from "./stripe/payment_error";

//magicLink || Account Recovery
import Enter from './views/Enter.js'
import AccountRecovery from "./views/AccountRecovery.js"

function App() {
  const [displayNav, setNav] = useState(false);
  const [user, setUser] = useState(null);
  const [myCart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  //products from db
  const [MenuList, setMenu] = useState([]);
  //stripe
  const apiKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(apiKey);
  //Account Recovery
  const sendEmail = async (paramEmail, magicLink) => {

    axios.post(URL+'/Guest/sendEmail', {email: paramEmail, magicLink})
    .then((res) => {
      if(res.data.ok)
      {
        loginHandle(res.data.token)
      }
      else{
        console.log(res.data.message)
    }})
    .catch((err)=>{
    console.log(err)
    })
    
  }
  //Get menuItems from Mongodb
  useEffect(()=> {
    const getMenu = async () => {
    try{
      const response = await axios.get(URL+'/Products/');
      //console.log(response)
      setMenu(response.data);
    }catch(e){  
      console.log("request to " + URL + "failed")
      console.log(e)
    }
  }
  getMenu();
  //Verify LocalStorage token
  const verify_token = async () => {
    try {
      if(!token){
        setUser("guest@gmail.com");
        console.log("token not found")
      } else {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(URL+'/Guest/verifyToken');
        //console.log(response);
        return response.data.ok ? loginHandle(token) : logout();
      }
    }catch(error){
      console.log(error)
    }
  }
  verify_token();

}, [])

let logout = () => {
  localStorage.removeItem("token");
  setUser('guest@gmail.com');
  setIsLoggedIn(false);
  setCart([]);
  alert("You have logged out");
}

let loginHandle = (token) => {
  let decodedToken = jose.decodeJwt(token);
  setUser(decodedToken.username);
  (decodedToken.cart.length > 0) ? setCart(decodedToken.cart) : setCart([])
  setIsLoggedIn(true);
  localStorage.setItem("token", JSON.stringify(token));
}

/* I have an issue in React where, I can't hide the navbar on the landing page,
so I pass navbar as true in most other views */

  return (
   <Router>
    <Navbar displayNav={displayNav}/>
    <Routes>
      <Route
      path={'/'}
      element={<LandingPage setNav={setNav}/>}
      />
      <Route 
      path={'/Menu'}
      element={<Menu MenuList={MenuList} logout={logout} setCart={setCart} user={user} setNav={setNav}/>}
      />
      <Route
      path={'/Cart'}
      element={
        <Elements stripe={stripePromise}>
          <Cart myCart={myCart} setCart={setCart} user={user} setNav={setNav}/>
        </Elements>
      }
      />
      <Route
      path={'/Login'}
      element={<Login setNav={setNav} loginHandle={loginHandle}/>}
      />
      <Route
      path={'/Register'}
      element={<Register setNav={setNav} loginHandle={loginHandle}/>}
      />
      <Route
        path="/payment/success"
        element={<PaymentSuccess
        setCart={setCart} 
        />}
      />
      <Route
        path="/payment/error"
        element={<PaymentError />}
      />
      <Route
        path="/AccountRecovery"
        element={<AccountRecovery 
        sendEmail={sendEmail}
        setNav={setNav}
      />}
    />
    </Routes>
   </Router>
  );
}

export default App;
