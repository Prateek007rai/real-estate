import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { Outlet } from "react-router-dom";
import RedirectRoute from "./RedirectRoute";


//use of this private route to prevent the user dashboard from opening in different private browser
const PrivateRoute = () => {
    //context
    const [auth, setAuth] = useAuth();

    const [ok, setOk] = useState(false);

    useEffect(()=>{
        if(auth?.token) getCurrentUser();
    }, [auth?.token]);

    const getCurrentUser = async () => {
        try{
            const {data} = await axios.get('/current-user' , {
                headers:{
                    authorization: auth?.token
                }
            })
            //here we took  and find the  {data} not for storing but if in getting the data any error came out
            // then catch will get the error and setOk will remian false.
            setOk(true);
        }catch(err){
            setOk(false);
        }
    }

    return ok ? <Outlet /> : <RedirectRoute />;                                            //outlet is here means, yes the children components can render
}
 
export default PrivateRoute;