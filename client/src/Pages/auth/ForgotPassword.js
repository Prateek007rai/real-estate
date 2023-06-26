import { useState } from "react"
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    //hooks
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            console.table({email});
            const { data } = await axios.post(`/forgot-password`, {email});

            console.log('>>>>>',data);
            if(data?.error){
                toast.error(data?.error);   
                setLoading(false);                                                             //it will show error in red color using toast.error()
            }else{
                toast.success("Check Email to reset Password!!!");
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
            <h1 className="bg-primary text-light p-5 display-1 mb-4">Forgot Password</h1>
            <div className="container">
               <div className="row">
                 <div className="col-lg-4 offset-lg-4">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Enter your Email"
                        className="form-control mb-4" required autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />

                        <button disabled={loading} className="btn btn-primary col-12 mb-4">
                            {loading ? "Waiting..." : "Send"}
                        </button>
                    </form>

                    <Link to='/login'>Back to login</Link>
                 </div>
               </div>
            </div>
        </div>
    )
}

export default ForgotPassword;