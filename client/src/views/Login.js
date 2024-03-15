import axios from "axios";
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
//config
import URL from '../components/config.js';

let Login = ({setNav,loginHandle}) => {

  useEffect(()=>{
	setNav(true)
  },[])

  const [form, setValues] = useState({
    username: "",
    password: "",
  });

  const [loginError, setError] = useState(null);

  let navigate = useNavigate();

	let handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submit")
		try{
		const response = await 
		axios.post(URL+'/Guest/login', 
		{username: form.username,
        password: form.password,});
		if(response.data.ok){
			//password match
			//navigate in 2 seconds
			setTimeout(() => {
            loginHandle(
			response.data.token)
			navigate('/Menu')
			}, 10);
		}else{
			setError(response.data.message)}
		}
		catch(error){console.log(error)}
	}

	let handleChange= (e) =>{
		setValues({ ...form, 
			[e.target.name]: e.target.value });
	}

	return (
	<>
		<form 
		onSubmit={handleSubmit}
		onChange={handleChange}
		className="flex flex-col items-center"
		>
			<h1 className="text-4xl font-bold mb-5 mt-3">Login</h1>
			<div className="flex flex-col">
				<input 
				placeholder="username"
				name="username" 
				className=" border-2 border-amber-700 p-3 rounded-3xl mb-2"
				/>
				<input 
				placeholder="password"
				name="password" 
				className="border-2 border-amber-700 p-3 rounded-3xl mb-2"
				type="password"
				/>
				<div className="flex justify-center">
					<button className="mt-1 bg-amber-600 p-3 rounded-3xl text-white">Submit</button>
				</div>

			</div>
		</form>
		<div className="flex flex-col items-center mt-2">
			<NavLink to={"/AccountRecovery"}>
				Forgot my password
			</NavLink>
			<NavLink to={"/Register"}
			style={{marginTop: 5}}>
				Register
			</NavLink>
		</div>
	</>)
}

export default Login