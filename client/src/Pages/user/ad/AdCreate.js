import { useState } from "react";
import Sidebar from "../../../components/nav/Sidebar";
import { useNavigate } from "react-router-dom";

const AdCreate = () => {

  const [sell, setSell] = useState(false);
  const [rent, setRent] = useState(false);
  //hooks
  const naviagte = useNavigate();

  const handleSell =() => {
    setSell(true);
    setRent(false);
  }

  const handleRent =() => {
    setSell(false);
    setRent(true);
  }

    return ( 
          <div>
            <h1 className="bg-primary text-light p-5 display-1">
              AdCreate
            </h1> 
            <Sidebar />

            <div className="d-flex justify-content-center align-items-center vh-100"
            style={{marginTop:"-12%",marginLeft:"6vw"}} >

              <div className="col-lg-6">
                <button onClick={handleSell} className="btn btn-primary btn-lg col-10 p-5">
                <span className="h3">Sell</span>
                </button>
                <div>
                  {sell && (
                    <div className="my-1">
                      <button onClick={()=> naviagte("/ad/create/sell/House")} className="btn btn-secondary p-5 col-5">House</button>
                      <button onClick={()=> naviagte("/ad/create/sell/Land")} className="btn btn-secondary p-5 col-5">Land</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6">
                <button onClick={handleRent} className="btn btn-primary btn-lg col-10 p-5">
                  <span className="h3">Rent</span>
                </button>
                <div>
                  {rent && (
                    <div className="my-1">
                      <button onClick={()=> naviagte("/ad/create/rent/House")} className="btn btn-secondary p-5 col-5">House</button>
                      <button onClick={()=> naviagte("/ad/create/rent/Land")} className="btn btn-secondary p-5 col-5">Land</button>
                    </div>
                  )}
                </div>
              </div>
           
            </div>
          </div>
     );
}
 
export default AdCreate;