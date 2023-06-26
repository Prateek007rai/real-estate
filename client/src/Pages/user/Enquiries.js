import { useEffect, useState } from "react";
import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from "../../context/auth";
import axios from "axios";
import AdCards from "../../components/cards/AdCards";


const Enquiries = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [ads, setAds] = useState([]);

  useEffect(()=> {
    if(auth.token){
      fetchAds();
    }
  }, [auth.token !== '']);


  const fetchAds = async() => {
    try{
        const {data} = await axios.get(`/enquired-properties`);
        console.log("wishist reponse -->", data)
        setAds(data);
    }catch(err){
      console.log(err);
    }
  }



    return ( 
        <div>
            <h1 className="bg-primary text-light p-5 display-1">
              Enquired Properties
            </h1> 
            <Sidebar />

            {!ads?.length ? (
              <div className="d-flex justify-content-center align-items-center vh-100">
                <h2 className="text-muted" style={{marginTop: "-40%"}}>You have not Enquired any property, Yet!!!</h2>
              </div>
            ) : (
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 offset-lg-2">
                    <h2 className="mt-5 mb-5"> All Enquiry</h2>
                    <hr/>
                    <p className="text-center text-muted">You have Enquired {ads?.length} ads</p>
                  </div>
                </div>

                <div className="row justify-content-evenly mb-5">
                  {ads?.map(ad => <AdCards ad={ad} key={ad._id}/>)}
                </div>
              </div>
            )}
        </div>
     );
}
 
export default Enquiries;