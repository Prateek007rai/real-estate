import { useState } from "react"
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    //hooks
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            console.table({email,password});
            const { data } = await axios.post(`/pre-register`, {email , password});

            console.log('>>>>>',data);
            if(data?.error){
                toast.error(data?.error);   
                setLoading(false);                                                             //it will show error in red color using toast.error()
            }else{
                toast.success("Please Check Your Email to activate your account !!!");
                setLoading(false);  
                navigate('/');
            }
        }catch(err){
            console.log("Error in submiting register form - ", err)
            toast.error("Something went much Wrong !!!");
            setLoading(false);  
        }
    }

    return (
        <div>
            <h1 className="bg-primary text-light p-5 display-1 mb-4">Register</h1>
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
                            {loading ? "Waiting..." : "Register"}
                        </button>
                    </form>
                 </div>
               </div>
            </div>
        </div>
    )
}

export default Register;