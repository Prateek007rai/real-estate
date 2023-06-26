import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const RedirectRoute = () => {
    //state
    const [count, setCount] = useState(5);
    //hook
    const navigate = useNavigate();

    useEffect(()=> {

       const interval = setInterval(() => {
         setCount((currCount) => --currCount);
       }, 1000)

       //redirect
       count === 0 && navigate('/');

       return () => clearInterval(interval)
    }, [count]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{marginTop: "-7%"}}>
            <h2>Please Login first, Redirecting in {count} seconds</h2>
        </div>
    )
}
 
export default RedirectRoute;