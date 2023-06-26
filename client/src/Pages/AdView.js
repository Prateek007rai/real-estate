import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "../components/misc/ImageGallery";
import AdFeatures from "../components/cards/AdFeatures";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeUnlike from "../components/misc/LikeUnlik";
import HTMLRenderer from 'react-html-renderer';
import AdCards from "../components/cards/AdCards";
import ContactSeller from "../components/forms/ContactSeller";

dayjs.extend(relativeTime);   //fromNow()  // 3 hours ago

const AdView = () => {
    //state
    const [ad, setAd] = useState({});
    const [related, setRelated] = useState([]);


    //params
    const params = useParams();

    console.log(params);

    useEffect(() => {
        if(params?.slug) fetchAd();
    }, [params?.slug]);

    const fetchAd =async() =>{
      try{
        const {data} = await axios.get(`/ad/${params?.slug}`);
        console.log(data);
        setAd(data?.ad);
        setRelated(data?.related)
      }catch(err){
        console.log(err);
      }
    }

    //used to add , commas in price
    function formatNumber(x){
      return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
     }

    
    const generatePhotosArray = (photos) => {
      if(photos?.length > 0){
          const x = photos.length === 1 ? 2 : 4 ;
          let arr = [];

          photos.map((p) =>
              arr.push({
                  src: p.Location,
                  width: x,
                  height: x
              })
          )
          return arr;
      }else{
          //return default value
          return [{
              src: "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600",
              width: 2,
              height: 2
          }]
      }
  }

    
    return ( 
    <>
      <div className="container-fluid">
        <div className="row mt-2 feat_div">
          <div className="col-lg-4">
            <div className="d-flex justify-content-between">
              <button className="btn btn-danger disabled mt-2">
                {ad?.type} for {ad?.action}
              </button>
              <div className="mt-2">
                <LikeUnlike ad={ad} />
              </div>
            </div>
            
            <div className="mt-4 mb-4">
              <p>{ad?.sold ? "❌ Off Market || Sold" : " ✅ On Market"}</p>
            </div>

            <h3 className="mb-4">{ad?.address}</h3>
            <AdFeatures ad={ad} />
            <h3 className="mt-4 mb-4">Rs. {formatNumber(ad?.price)}/-</h3>
            <p className="time">🕐 {dayjs(ad?.createdAt).fromNow()}</p>

          </div>
          <div className="col-lg-8">
            <ImageGallery photos={generatePhotosArray(ad?.photos)} />
          </div>
        </div>
      </div>
  
      <div className="container mb-5 mt-5 justify-content-between">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <h1>
              {ad.type} in {ad.address} for {ad.action}
            </h1>

            <hr />
            <AdFeatures ad={ad} />
            <h3 className="mt-4 mb-4">Rs. {formatNumber(ad?.price)}/-</h3>

            <hr />

            <h3 className="fw-600">{ad?.title}</h3>
            <p className="lead">{ad.description}</p>
            {/* <HTMLRenderer html={ad.description.replaceAll(".", "<br/><br/>")} /> */}
          </div>
        </div>
      </div>

      <div className="container">
        <ContactSeller ad={ad} />
      </div>

      {/* this div is for related items */}
      <div className="container-fluid mb-5 mt-5 justify-content-between related_div">
        <div className="row">
          <h4>Related Ads</h4>
          {related?.map(ad => (<AdCards key={ad._id} ad={ad} />))}
        </div>
      </div>
      {/* <pre>{JSON.stringify({ad, related}, null, 4)}</pre> */}
    </> );
}
 
export default AdView;