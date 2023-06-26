import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";


const Main = () => {
   //context
   const [auth, setAuth] = useAuth();
   //hooks
   const navigate = useNavigate();

   const Logout = async() => {
    setAuth({user: null,
            token: "",
            refreshToken: "",})
    localStorage.removeItem("auth");
    navigate("/login");
   }

   const LoggedIn = auth.user !== null && auth.token !== '' ;

   const handlePostAdLink = () => {
    if(LoggedIn){
        navigate("/ad/create")
    }else{
        navigate("/login")
    }
   }


    return ( 
        <div>
            <nav className="nav d-flex justify-content-between lead">
                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>

                <NavLink className="nav-link" aria-current="page" to="/search">Search</NavLink>

                <NavLink className="nav-link" aria-current="page" to="/buy">Buy</NavLink>
                <NavLink className="nav-link" aria-current="page" to="/rent">Rent</NavLink>

                <NavLink className="nav-link" aria-current="page" to="/agents">Agents</NavLink>

                <a className="nav-link pointer" onClick={handlePostAdLink}> Post Ad </a>

                {!LoggedIn ? 
                <>
                    <NavLink className="nav-link" to="/login">Login</NavLink>

                    <NavLink className="nav-link" to="/register">Register</NavLink>
                </> : ''}
            

                {LoggedIn ? 
                    <div className="dropdown">
                    <li>
                    <a className="nav-link dropdown-toggle pointer" data-bs-toggle="dropdown" >
                        {auth?.user?.name ? auth.user.name : auth.user.username}
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                        <NavLink className="nav-link dropdown-ME" to="/dashboard">Dashboard</NavLink>
                        </li>
                        <li>
                            <a onClick={Logout} className="nav-link pointer dropdown-ME">Logout</a>
                        </li>
                    </ul>
                    </li>
                    </div> : ""
                }
            </nav>    
        </div>
     );
}
 
export default Main;