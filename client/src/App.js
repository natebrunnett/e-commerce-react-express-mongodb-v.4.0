import './App.css';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login"
import Admin from "./components/Admin"
import Navbar from "./components/Navbar.js"
import Products from "./components/Products.js"
import Register from "./components/Register"
import Cart from "./components/Cart"
import * as jose from "jose";

//stripe
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import PaymentSuccess from "./containers/payment_success";
import PaymentError from "./containers/payment_error";

//magicLink
import Enter from './components/Enter.js'
import ForgottenPassword from "./components/ForgottenPassword.js"

//config
import URL from './config.js';

function App() {

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null)
const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
const [cart, setCart] = useState([]);

//stripe
const apiKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(apiKey);

//products from db
const [thisProducts, setProducts] = useState([]);

useEffect(()=> {
  const getProducts = async () => {
    try{
      console.log("trying products, Hello World");
      const response = await axios.get(URL+'/Products/');
      //console.log(response)
      setProducts(response.data);
    }catch(e){  
      console.log("request to " + URL + "failed")
      console.log(e)
    }
  }
  getProducts();

}, [])

useEffect(() => {
  const verify_token = async () => {
    try {
      if(!token){
        setIsLoggedIn(false)
        console.log("no token")
        console.log(token)
      } else {
        console.log("token found")
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(URL+'/Login/verifyToken');
        //console.log(response);
        return response.data.ok ? login(token) : logout();
      }
    }catch(error){
      console.log(error)
    }
  }
  verify_token();
  console.log("useEffect1=" + user)
}, [token]);

const getCart = async () => {
    axios.post(URL+'/Login/getCart', 
      {username:user})
    .then((res) => {
      // console.log("user " + user)
      // console.log("res: " + res.data)
      if (res.data !== "cannot find user") setCart(res.data);
    })
    .catch((err)=>{
      console.log("cart failing" + err)
    })
  }

useEffect(()=>{
  console.log("useEffect2=" + user)
  if(user) getCart();
}, [user])

let UserInfo = () => {
  return (
    <>
      {
        isLoggedIn === true && <> 
        <div className="UserInfo">
        <p><b>{user}</b></p>
        <button onClick={logout}>logout</button>
        </div> 
        </>
      }
    </>
  );
}

let checkToken = () => {
  console.log(token)
}

let logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  setIsLoggedIn(false);
  setCart([]);
  alert("You have logged out");
}

let login = (token) => {
  let decodedToken = jose.decodeJwt(token);
  setUser(decodedToken.username);
  setIsLoggedIn(true);
  localStorage.setItem("token", JSON.stringify(token));
  alert('Welcome back!')
}


//after a payment, plug id: all into this function and we will call a delete all function in the controller if id === all 
let removeFromCart = (thisId) => {
  axios.post(URL+'/Login/deleteCartItem', 
      {username:user, id: thisId})
    .then((res) => {
      setCart(res.data);
      alert("Dish removed");
    })
    .catch((err)=>{
      console.log(err)
    })
}

let AddToCart = (idx) =>
{
  if(isLoggedIn){
  let newItem = {}
  newItem = thisProducts[parseInt(idx.idx)];
  //axios post will add newItem to cart in db
  //then it will return the updated cart
  //setCart with the newcart response
  axios.post(URL+'/Login/update', 
      {username:user, product: newItem})
    .then((res) => {
      setCart(res.data);
      alert("Dish added to your cart")
      console.log(cart);
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  else{
    alert("Please login to continue")
  }
  
}

//magic link
let [thisEmail, setThisEmail] = useState('')

  const sendEmail = async (paramEmail, magicLink) => {

    axios.post(URL+'/Login/sendEmail', {email: paramEmail, magicLink})
    .then((res) => {
      if(res.data.ok)
      {
        login(res.data.token)
      }
      else
        alert(res.data.message)
    })
    .catch((err)=>{
    console.log(err)
    })
    
  }

  return (
   <Router>
      <UserInfo />
      <Navbar isLoggedIn={isLoggedIn}/>
      <Routes>
        <Route path="/" element={<Navigate to="/Categories" />} />
        <Route path="/Login" element={<Login login={login}/>} />
        {/* <Route path="/Admin" element={<Admin />} /> */}
        <Route path="/Categories" element={<Products AddToCart={AddToCart} thisProducts={thisProducts}/>} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Cart" element={
          <Elements stripe={stripePromise}>
            <Cart 
            removeFromCart={removeFromCart} cart={cart}
            getCart={getCart} user={user}
            />
          </Elements>
        } />
        <Route
          path="/payment/success"
          element={<PaymentSuccess
          setCart={setCart} user={user}
          />}
        />
        <Route
          path="/payment/error"
          element={<PaymentError />}
        />
        <Route
          path="/ForgottenPassword"
          element={<ForgottenPassword 
          login={login}
          thisEmail={thisEmail}
          setThisEmail={setThisEmail}
          sendEmail={sendEmail}
          />}
        />
        <Route
          path="sendEmail/:email/:link"
          element={<Enter sendEmail={sendEmail} thisEmail={thisEmail}/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
