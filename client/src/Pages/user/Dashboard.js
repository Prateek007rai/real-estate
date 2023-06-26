import { useEffect, useState } from "react";
import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from "../../context/auth";
import axios from "axios";
import UserAdCards from "../../components/cards/UserAdCards";


const Dashboard = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  useEffect(()=> {
    if(auth.token){
      fetchAds();
    }
  }, [auth.token !== '']);


  useEffect(()=> {
    if(page === 1) return ;

    fetchAds();
  }, [page])


  const fetchAds = async() => {
    try{
        const {data} = await axios.get(`/user-ads/${page}`);

        setAds([...ads, ...data.ads]);
        setTotal(data.total);
    }catch(err){
      console.log(err);
    }
  }

  // const loadMore = async() => {
  //   try{
  //       setLoading(true);
  //       const {data} = await axios.get(`/user-ads/${page}`);
  //       setAds([...ads, ...data.ads]);
  //       setTotal(data.total);
  //       setLoading(false);
  //   }catch(err){
  //     console.log(err);
  //     setLoading(false);
  //   }
  // }


  //check if user is just buyer or both seller and buyer
  const seller = auth.user?.role?.includes("Seller");


    return ( 
        <div>
            <h1 className="bg-primary text-light p-5 display-1">
              Dashboard
            </h1> 
            <Sidebar />

            {!seller ? (
              <div className="d-flex justify-content-center align-items-center vh-100">
                <h2>{auth.user?.name ? auth.user?.name : auth.user?.username}, Welcome to Real Estate App</h2>
              </div>
            ) : (
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 offset-lg-2">
                    <h2 className="mt-5 mb-5">List of Ads</h2>
                    <hr/>
                    <p className="text-center text-muted">Total {total} ads found</p>
                  </div>
                </div>

                <div className="row justify-content-evenly mb-5">
                  {ads?.map(ad => <UserAdCards ad={ad} key={ad._id}/>)}
                </div>

                {ads?.length < total ? <div className="row">
                  <div className="col text-center mt-4 mb-4">
                    <button disabled={loading} className="btn btn-warning" onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}>
                      {loading ? "loading..." : `${ads?.length}/${total} Load More`}
                    </button>
                  </div>
                </div> 
                : "" }
              </div>
            )}
        </div>
     );
}
 
export default Dashboard;