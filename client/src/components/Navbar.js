import React from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Navbar = ({displayNav, user, logout}) => {
  let navigate = useNavigate();
	return (
  <>
  {displayNav &&
    <div className="flex flex-row bg-black justify-between items-center">
    <NavLink to={"/Menu"} className="text-3xl font-bold flex items-center gap-1 pt-1 pb-1 pl-2"
    style={ ({isActive}) => (
      isActive ? linkStyles.activeLink : linkStyles.defaultLink
    )}>Entrees<MdRestaurantMenu size={"32px"}/>
    </NavLink>

    <NavLink to={"/Login"} className="text-3xl font-bold flex items-center gap-1 pr-2 pt-1 pb-1 pr-2"
    style={ ({isActive}) => (
      isActive ? linkStyles.activeLink : linkStyles.defaultLink
    )}>        {(user == 'guest@gmail.com')? <button className='' onClick={() => navigate('/Login')}>Log in</button> : <button  
    className='' onClick={()=>logout()}>Logout</button>}
    </NavLink>
    </div>
  }
  </>
	)
}

export default Navbar

const linkStyles = {
  activeLink: {
    color: "gray",
  },
  defaultLink: {
    textDecoration: "none",
    color: "white",
  },
};
//