import { useEffect, useState } from "react"
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script';

const Login = () => {
    //context
    const [auth, setAuth] = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    //hooks
    const navigate = useNavigate();
    const location = useLocation();

    //google sign in starts
    const clientId = "242460118313-agspf5e476gv6jdiu0uujdoj9r6j6r1r.apps.googleusercontent.com";
    
    useEffect (() => {
        function start() {
        gapi.client.init({
        clientId: clientId,
        scope: ""
        })
        };
        gapi.load('client:auth2', start);
    });

    const onSuccess = async(res) => {
        console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
        const {email, name , googleId} = res.profileObj ;
        console.log("data is here ---->", email, name , googleId);
        const { data } = await axios.post(`/google-login`, {email , name , googleId});

        console.log('>>>>>',data);
        if(data?.error){
            toast.error(data?.error);                                                               //it will show error in red color using toast.error()
        }else{
            setAuth(data);
            localStorage.setItem("auth", JSON.stringify(data));
            toast.success("Google LoggedIn Successfully !!!"); 
            location?.state !== null ? navigate(location.state) : navigate('/');
        }

    }
    const onFailure = (res) => {
        console.log("LOGIN FAILED! res: ", res);
    }
     

    // google ends

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            console.table({email,password});
            const { data } = await axios.post(`/login`, {email , password});

            console.log('>>>>>',data);
            if(data?.error){
                toast.error(data?.error);   
                setLoading(false);                                                             //it will show error in red color using toast.error()
            }else{
                setAuth(data);
                localStorage.setItem("auth", JSON.stringify(data));
                toast.success("LoggedIn Successfully !!!");
                setLoading(false);  
                navigate('/');
            }
        }catch(err){
            console.log("Error in submiting register form - ", err)
            toast.error("Something went Wrong !!!");
            setLoading(false);  
        }
    }

    return (
        <div>
            <h1 className="bg-primary text-light p-5 display-1 mb-4">Login</h1>
            <div className="container">
               <div className="row">
                 <div className="col-lg-4 offset-lg-4">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Enter your Email"
                        className="form-control mb-4" required autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />

                        <input type="password" placeholder="Enter your Password"
                        className="form-control mb-4" required autoFocus
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />

                        <button disabled={loading} className="btn btn-primary col-12 mb-4">
                            {loading ? "Waiting..." : "Login"}
                        </button>
                    </form>

                    <Link to='/auth/forgot-password' className="text-danger ">Forgot Password</Link>
 
                    <p className="seperator">--------------------- or ----------------------</p>

                        <GoogleLogin
                        clientId={clientId}
                        buttonText="Login"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookie Policy={'single_host_origin'}
                        issignedIn={true} />
                 </div>
               </div>
            </div>
        </div>
    )
}

export default Login;