import axios from "axios";
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

let ForgottenPassword = (props) => {

let handleChange = (e) => {
	props.setEmail(e.target.value);
}

	return(
	<>
	<div className="Login">
		<h1>Forgotten password</h1>
		<input 
		onChange={handleChange} 
		placeholder="email" 
		type='email' 
		value={props.thisEmail}/>
		<button 
		onClick={() => props.sendLink(props.thisEmail)}
		style={{marginLeft: 90, marginRight: 90}}
		>Submit</button>
	</div>
	</>
	)
}

export default ForgottenPassword