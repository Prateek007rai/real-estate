import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import AdCards from "../components/cards/AdCards";
import SearchForm from "../components/forms/SearchForm";

const Home = () => {

    //state
    const [adsForSell, setAdsForSell] = useState();
    const [adsForRent, setAdsForRent] = useState();

     //context
    const [auth, setAuth] = useAuth();

    useEffect(() => { fetchAds(); } ,[]);

    const fetchAds = async() => {
       try{
        const {data} = await axios.get('/ads');

        setAdsForRent(data?.adsForRent);
        setAdsForSell(data?.adsForSell);

       }catch(err){
        console.log(err);
       }
    }


    return (
        <div>
            <SearchForm />
            <h1 className="bg-primary text-light p-5 display-1">Home</h1>

            <h3 className=" p-5 display-1">For Sell</h3>
            <div className="container">
                <div className="row">
                    {adsForSell?.map((ad)=>(
                        <AdCards ad={ad} key={ad._id} />
                    ))}
                </div>
            </div>

            <h3 className="p-5 display-1">For Rent</h3>

            <div className="container">
                <div className="row">
                    {adsForRent?.map((ad)=>(
                        <AdCards ad={ad} key={ad._id} />
                    ))}
                </div>
            </div>
            {/* <pre>{JSON.stringify({adsForSell, adsForRent},null,4)}</pre> */}
        </div>
    )
}

export default Home;