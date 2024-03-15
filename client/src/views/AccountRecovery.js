import axios from "axios";
import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";

let ForgottenPassword = ({setNav, sendEmail}) => {

	useEffect(()=>{
		setNav(true);
	}, [])

	const [email, setEmail] = useState('')

	let handleChange = (e) => {
		setEmail(e.target.value);
	}

	return(
	<>
	<div className="flex flex-col items-center">
		<h1 className="text-3xl font-bold mt-5 mb-5 text-amber-700">Recovery</h1>
		<input 
			onChange={handleChange} 
			placeholder="email" 
			value={email}
			type="email"
			className="border-2 p-3 rounded-3xl"
		/>

		<button 
			style={{padding: 10}}
			onClick={() => sendEmail(email)}
			className="bg-amber-700 text-white mt-5 rounded-3xl"
		>SendEmail</button>
		<p className="italic w-96 text-center mt-5">
			Developer note - this will use nodemailer to send you a login link to your email
		</p>
	</div>
	</>
	)
}

export default ForgottenPassword