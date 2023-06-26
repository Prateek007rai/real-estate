import { useEffect, useState } from "react";
import axios from "axios";
import AdCards from "../components/cards/AdCards";
import SearchForm from "../components/forms/SearchForm";

const Rent = () => {

    //state
    const [ads, setAds] = useState();

    useEffect(() => { fetchAds(); } ,[]);

    const fetchAds = async() => {
       try{
        const {data} = await axios.get('/ads-for-rent');

        setAds(data);

       }catch(err){
        console.log(err);
       }
    }


    return (
        <div>
            <SearchForm />
            <h1 className="bg-primary text-light p-5 display-1">For Rent</h1>

            <div className="container">
                <div className="row">
                    {ads?.map((ad)=>(
                        <AdCards ad={ad} key={ad._id} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Rent;