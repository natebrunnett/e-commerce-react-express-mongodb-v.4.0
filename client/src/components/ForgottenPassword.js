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
			type="email"
		/>

		<button 
			style={{padding: 10}}
			onClick={() => props.sendEmail(props.thisEmail)}
		>SendEmail</button>
		
	</div>
	</>
	)
}

export default ForgottenPassword