import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth";

const AccessAccount = () => {
    //conetxt
    const [auth, setAuth] = useAuth();
    //hooks
    const {token} = useParams();
    const navigate = useNavigate();
    console.log(token);

    useEffect(()=>{
       if(token) requestAccess();
    }, [token])

    const requestAccess = async() => {
        try{
            const { data } = await axios.post(`/access-account`, {resetCode: token});

            if(data?.error){
                toast.error(data?.error);                                                                //it will show error in red color using toast.error()
            }else{
                //save in local storage
                localStorage.setItem("auth", JSON.stringify(data))
                //save in the context
                setAuth(data);
                toast.success("Successfully Account Accessed !!!");  
                setTimeout(()=>{
                    navigate("/");
                },3000)
            }
            

        }catch(err){
            console.log(err);
            toast.error("Something went Wrong !!!");
        }
    }

    return ( 
        <div className="display-1 d-flex justify-content-center align-items-center vh-100">
            Please Wait ....
        </div>
     );
}
 
export default AccessAccount;