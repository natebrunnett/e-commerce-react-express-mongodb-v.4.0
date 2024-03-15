import React from 'react';
import {useEffect, useState} from "react"
import { useNavigate } from 'react-router-dom';
import URL from '../components/config.js'
import axios from 'axios'
import * as jose from 'jose'

let Menu = ({MenuList, setCart, setNav, user, logout}) => {

    useEffect(()=>{
        setNav(true)
    }, [])

    let navigate = useNavigate()

	let renderProducts=()=>(
        MenuList.map((prod,idx)=>{
            let thisPrice = parseFloat(prod.price * .01).toFixed(2);
            return(
                <div key={idx} className="flex flex-col items-center mb-3">
                    <img className="w-96 rounded-3xl" src={prod.image[0]} />
                    <button className=' bg-amber-700 text-white p-3 absolute mt-80 rounded-3xl' 
                    onClick={() => AddToCart(idx)}>Add to cart</button>	
                    <div className="" ><b>{prod.name}</b></div>
                    <p style={{ fontSize: '14px'}}><b>{thisPrice}€</b></p>
                    <p className="" >{prod.description}</p>
                    <p>Quantity: {prod.quantity}</p>

                </div>
            )
        })
    )

    let AddToCart = (number) =>
    {
    if(user != null){
    //get menuItem data from mongoDb
    let menuItem = {}
    menuItem = MenuList[parseInt(number)];
    //setCart with the newCart data using a token to store it in LocalStorage
    axios.post(URL+'/Guest/addItem', 
        {username:user, product: menuItem})
    .then((res) => {
        let decodedToken = jose.decodeJwt(res.data.token);
        (decodedToken.cart.length > 0) && setCart(decodedToken.cart)
        localStorage.setItem("token", JSON.stringify(res.data.token));
    })
    .catch((err)=>{
        console.log(err)
    })
    }
    else{
    alert("Please login to continue")
    }

    }

	
    return (
	<>

    <div className='flex flex-col items-center'>
    <h1 className='mb-3 mt-3'>Hello, {user}</h1>
    {(user == 'guest@gmail.com')? <button className='bg-amber-700 p-4 rounded-3xl text-white' onClick={() => navigate('/Login')}>Log in</button> : <button  
    className='bg-amber-700 p-4 rounded-3xl text-white' onClick={()=>logout()}>Logout</button>}
    <h1 className='font-bold text-4xl mb-3'>Order now :)</h1>
	</div>
	{renderProducts()}

	
    </>)
}

export default Menu