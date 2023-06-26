import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";


const ContactSeller = ({ad}) => {
    //context
    const [auth, setAuth] = useAuth();

    //state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    //hooks
    const navigate = useNavigate();

    //check user is logged in
    const loggedIn = auth.user !== null && auth.token !== '';


    useEffect(() => {
        if(auth?.user){
            setName(auth.user?.name);
            setEmail(auth.user?.email);
            setPhone(auth.user?.phone);
        }
    }, [auth?.user]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const {data} = await axios.post('/contact-seller' , {
                name,
                email,
                phone,
                message,
                adId: ad._id
            });

            if(data?.error){
                toast.error(data.error);
                setLoading(false);
            }else{
                toast.success("Enuquiry Sended as Email to seller !!!")
                setLoading(false);
                setMessage("");
            }
        }catch(err){
            console.log(err);
            toast.error("Something went wrong. Try again.")
            setLoading(false);
        }
    }


    return ( 
        <div className="row">
            <div className="col-lg-8 offset-lg-2">
                <h3>
                    Contact {ad?.postedBy?.name ? ad?.postedBy?.name : ad?.postedBy?.username} 
                </h3>

                <form onSubmit={handleSubmit}>
                    <textarea 
                    name="message" 
                    className="form-control mb-4 mt-4" 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    autoFocus={true}
                    placeholder="Write Your Message"
                    disabled={!loggedIn}   
                    ></textarea>

                    {/* name */}
                    <input type='text' 
                        placeholder='Enter Your Name'
                        className='form-control mb-4'
                        value={name}                                                      
                        onChange={(e) => setName(e.target.value)}      
                        disabled={!loggedIn}      
                        />

                    {/* email */}
                    <input type='email' 
                    placeholder='Enter Your Email'
                    className='form-control mb-4'
                    value={email}                                                      
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled={!loggedIn}   
                    />    

                    {/* phone */}
                    <input type='text' 
                    placeholder='Enter Your Phone number'
                    className='form-control mb-4'
                    value={phone}                                                      
                    onChange={(e) => setPhone(e.target.value)}  
                    disabled={!loggedIn}       
                    />  

                    <button className="btn btn-danger" disabled={!name || !email || loading}>
                        {loggedIn ? loading ? "Please Wait..." : "Send Enquiry" : "login to send enquiry"}
                    </button>
                </form>
            </div>
        </div>
     );
}
 
export default ContactSeller;