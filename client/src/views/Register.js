import {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
//config
import URL from '../components/config.js';

let Register = ({loginHandle, setNav}) => {

  useEffect(() => {
    setNav(true)
  },[])

 	const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const navigate = useNavigate();

  let handleChange1=(e)=>{
    setInput1(e.target.value)
    console.log(input1)
  }

  let handleChange2=(e)=>{
    setInput2(e.target.value)
    console.log(input2)
  }

  let addUser=()=>{
    axios.post(URL+'/Guest/addGuest', {username:input1,
    password:input2})
    .then((res)=>{
      if(res.data.ok === false)
      {
        alert(`false ${res.data.message}`);
        console.log(res.data)
      }
      else
      {
        loginHandle(res.data.token)
        navigate("/Menu");
      }
      setInput1('');
      setInput2('');

    })
    .catch((err)=>{
      console.log(err)
    })
  }

	return(
	<>
  <div className="flex flex-col items-center">
      <h1 className='text-3xl mt-3 mb-3 font-bold'>Register</h1>
      <p className='text-sm w-96 text-center'>Note from developer - a real email address gives account recovery to the user, however a@a.com can be used for testing purposes</p>
      <input 
      className=' border-2 border-amber-700 p-3 rounded-3xl mt-3 mb-3'
      value={input1} onChange={handleChange1}
      placeholder="email"/>
      <input 
      className=' border-2 border-amber-700 p-3 rounded-3xl mb-3'
      value={input2} onChange={handleChange2} type="password"
      placeholder="password"/>
      
      <button 
      className='bg-amber-700 text-white p-3 rounded-3xl'
      onClick={addUser}>Submit</button>
	</div>
  </>
	)
}

export default Register