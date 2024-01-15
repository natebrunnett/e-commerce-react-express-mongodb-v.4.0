import axios from "axios";
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

let ForgottenPassword = (props) => {

	let handleChange = (e) => {
		props.setThisEmail(e.target.value);
	}

	return(
	<>
	<div className="Login">
		<h1>Forgotten password</h1>
		<input 
			onChange={handleChange} 
			placeholder="email" 
			value={props.thisEmail}
		/>
		<p style={{padding: 10}}>{props.thisEmail}</p>
		<button 
			onClick={() => props.sendLink(props.thisEmail)}
			style={{marginLeft: 90, marginRight: 90}}
		>Submit</button>
		{/* <input></input>
		<button 
			style={{padding: 10}}
			onClick={() => props.sendEmail()}
		>SendEmail</button> */}
	</div>
	</>
	)
}

export default ForgottenPassword