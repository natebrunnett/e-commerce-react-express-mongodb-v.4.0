import React, {useEffect} from "react";
import axios from 'axios';
import URL from '../components/config';
import { FaTrashAlt } from "react-icons/fa";
import * as jose from 'jose'
import { useNavigate } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import stripeImg from '../media/stripeImg.png'

let Cart = ({myCart, setCart, user, setNav}) => {

useEffect(()=>{
    setNav(true)
}, [])
    
//stripe
const navigate = useNavigate();
const stripe = useStripe();

const createCheckoutSession = async () => {
    try {
      const response = await axios.post(
        URL+`/payment/create-checkout-session`,
        { list: myCart, username: user }
      );
      if(response.data.ok){
        localStorage.setItem(
          "sessionId",
          JSON.stringify(response.data.sessionId)
        )
      console.log("clear cart function")
      let decodedToken = jose.decodeJwt(response.data.token);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      redirect(response.data.sessionId)
      }
      else {
        navigate("/payment/error");
      }
    } catch (error) {
      navigate("/payment/error");
    }
  };

const redirect = (sessionId) => {
   
    stripe
      .redirectToCheckout({
        sessionId: sessionId,
      })
      .then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });
  };


const calculate_total = () => {
    let total = 0;
    myCart.forEach((ele) => (total += ele.quantity * ele.price));
    total = parseFloat(total * .01).toFixed(2);
    return total;
    };

const deleteCartItem = async(prodId) => {
    try {
        const res = await axios.post(URL+'/Guest/deleteCartItem',{username: user, id: prodId})
        if(res.data.ok == true){
            let decodedToken = jose.decodeJwt(res.data.token);
            setCart(decodedToken.cart)
            localStorage.setItem("token", JSON.stringify(res.data.token));
        } 
        else{
            console.log(res.data.error)
        }
    } catch (error) {
        console.log(error)
    }
} 



/*

cartItem ({
  image: {type: Array, required: false},
  name: {type: String, required: true},
  description: {type: String, required: false},
  price: {type: Number, required: true},
  quantity: {type: Number, required: false},
  id: unique uuid
});

*/


return(
<div className='flex flex-col items-center gap-4'>
<h1 className="font-bold text-7xl mt-3">Cart</h1>
<p className="w-96 text-center">Developer note - the guest cart is shared across platforms via Mongodb for demonstration purposes</p>

{myCart.length > 0 && myCart.map((data, idx) => {
    let thisPrice = parseFloat(data.price * .01).toFixed(2);
    return(
        <div key={idx} className="flex flex-col items-center">
            <img className='w-64 rounded-3xl' src={data.image[0]}/>
            <button className=' bg-amber-700 text-white p-3 absolute mt-48 ml-48 rounded-3xl' 
                    onClick={() => deleteCartItem(data.id)}><FaTrashAlt size={"28px"}/></button>	
            <div className="flex items-center gap-2 justify-between w-48 mb-2 mt-1">
            <h1>{data.name}</h1>
            <div className="flex flex-row items-center gap-2">
                <h1>{thisPrice}</h1>
                <h1>{data.quantity}</h1>
            </div>
            </div>

        </div>
    )
})}
<h1>Total {calculate_total()} €</h1>
<button 
className="bg-amber-700 text-white p-3 text-3xl rounded-3xl italic pr-4"
onClick={()=> createCheckoutSession()}>STRIPE</button>
<p className="w-96 text-center mt-3 italic">For payment use 4242-4242-4242-4242 for the card number,
  expiration date and cvc.  Enter any details 
  for personal info, this function is only for debugging purposes.
</p>
<p className="italic font-bold">For example</p>
<img src={stripeImg} className="border-2 rounded-3xl"></img>
</div>
)
}
export default Cart