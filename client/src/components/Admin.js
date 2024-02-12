import {useState} from 'react';
import axios from 'axios';
//config
import URL from '../config.js';


let Admin = () => {
  const [users, setUsers] = useState([]);
  const [inputRemove, setInputRemove] = useState('');

  let getUsers = () => {
    axios.get(URL+'/Login')
    .then((res)=>{
      setUsers(res.data)
      console.log(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  let renderUsers=()=>(
    users.map((user,idx)=><li key={idx}>{user.username}</li>)
    )

  let handleChange3=(e)=>{
    setInputRemove(e.target.value)
    console.log(inputRemove)
  }


  let removeUser=()=>{
    axios.post(URL+'/Login/remove', {username:inputRemove})
    .then((res) => {
      console.log(res.data)
      alert(`User ${res.data.name} was removed`)
      setInputRemove('')
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  return(
  <>
      <div className="container">
      <h1>Get Users</h1>
      <button onClick={getUsers}>display</button>
      <ul>
      {renderUsers()}
      </ul>
      </div>

      <div className="remove">
      <h1>Remove User</h1>
      <input value={inputRemove} onChange={handleChange3}
      placeholder="user"/>
      <button onClick={removeUser}>Delete</button>
      </div>

  </>
  )
}

export default Admin