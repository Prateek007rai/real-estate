import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth";

const AccountActivate = () => {
    //conetxt
    const [auth, setAuth] = useAuth();
    //hooks
    const {token} = useParams();
    const navigate = useNavigate();
    console.log(token);

    useEffect(()=>{
        if(token) requestActivation();
    }, [token])

    const requestActivation = async() => {
        try{
            const { data } = await axios.post(`/register`, {token});

            if(data?.error){
                toast.error(data?.error);                                                                //it will show error in red color using toast.error()
            }else{
                //save in local storage
                localStorage.setItem("auth", JSON.stringify(data))
                //save in the context
                setAuth(data);
                toast.success("Successfully Logged in !!! Enjoy the App");  
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
 
export default AccountActivate;