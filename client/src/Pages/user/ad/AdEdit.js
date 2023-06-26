import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import ImageUpload from '../../../components/forms/ImageUploads';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {nanoid} from 'nanoid';
import Sidebar from '../../../components/nav/Sidebar';

//action is sell or rent, type = House/Land
const AdEdit = () => {

    //hook
    const navigate = useNavigate();
    const params = useParams();

    const [ad, setAd] = useState({
        _id: '',
        photos: [],
        uploading: false,
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        carpark: '',
        landsize: '',
        title: '',
        // slug: nanoid(6),
        description: '',
        loading: false,
        type: '',                         //this type & action came from props
        action: ''
    })

    const [loaded, setLoaded] = useState(false);

    useEffect(()=> {
        if(params?.slug){
            console.log("Params' slug ==>", params.slug);
            fetchAd();
        }
    }, [params?.slug])


    const fetchAd = async() => {
        try{
            const {data} = await axios.get(`/ad/${params?.slug}`);
            console.log("Data coming ==>", data);
            setAd(data.ad);
            setLoaded(true);
        }catch(err){
          console.log(err);
        }
      }


    const handleClick = async() => {
        try{
            //validations
            if(!ad?.photos.length){
                toast.error("Photo is required !! atleast one");
                return ;
            }
            if(!ad?.price){
                toast.error("Price is required !!");
                return ;
            }
            if(!ad?.address){
                toast.error("Address is required !!");
                return ;
            }
           setAd({ ...ad, loading: true });
           console.log("ad data sended to server", ad );
           const {data} = await axios.put(`/ad/${ad._id}`, ad);

           console.log("ad create response : ", data );

           if(data?.error){
            toast.error(data.error);
            setAd({ ...ad, loading: false });
           }else{
            toast.success("ad Updated !!!");
            setTimeout(()=> {
                navigate('/dashboard');
                setAd({ ...ad, loading: false });
            }, 1000);
            
            // navigate('/dashboard');
           }
        }catch(err){
            console.log("Error in submiting the form ---->",err)
            setAd({ ...ad, loading: false });
        }
    }

    const handleDelete = async() => {
        try{
            setAd({ ...ad, loading: true });
           console.log("ad data sended to server", ad );
           const {data} = await axios.delete(`/ad/${ad._id}`);

           console.log("ad create response : ", data );

           if(data?.error){
            toast.error(data.error);
            setAd({ ...ad, loading: false });
           }else{
            toast.success("ad Deleted !!!");
            navigate('/dashboard');
            setAd({ ...ad, loading: false });
           }
        }catch(err){
            console.log("Error in submiting the form ---->",err)
            setAd({ ...ad, loading: false });
        }
    }


    return ( 
        <>
            <h1 className="bg-primary text-light p-5 display-1">
              Edit Ad
            </h1> 
            <Sidebar />
            
          <div className='mb-0 w-50 text-center m-auto'>

            <ImageUpload ad={ad} setAd={setAd}/>

                <input type='text' 
                className='form-control mb-3 mt-5' min='0' 
                placeholder='Enter address'
                value={ad.address}
                onChange={e => setAd({...ad, address: e.target.value})}
                />
                { loaded ? <CurrencyInput
                 className='form-control mb-3'
                placeholder="Please enter Price"
                defaultValue={ad.price}
                decimalsLimit={2}
                onValueChange={(value) => setAd({...ad, price: value})}
                />
                : ''}

                {ad.type === "House" ? 
                (<>
                    <input type='number' 
                    className='form-control mb-3' min='0' 
                    placeholder='Enter Bedrooms'
                    value={ad.bedrooms}
                    onChange={e => setAd({...ad, bedrooms: e.target.value})}
                    />
                    
                    <input type='number' 
                    className='form-control mb-3' min='0' 
                    placeholder='Enter bathrooms'
                    value={ad.bathrooms}
                    onChange={e => setAd({...ad, bathrooms: e.target.value})}
                    />

                    <input type='number' 
                    className='form-control mb-3' min='0' 
                    placeholder='Enter carpark'
                    value={ad.carpark}
                    onChange={e => setAd({...ad, carpark: e.target.value})}
                    />
                </>) : (" ")}

                <input type='text' 
                className='form-control mb-3' min='0' 
                placeholder='Enter landsize'
                value={ad.landsize}
                onChange={e => setAd({...ad, landsize: e.target.value})}
                />

                <input type='text' 
                className='form-control mb-3' min='0' 
                placeholder='Enter title'
                value={ad.title}
                onChange={e => setAd({...ad, title: e.target.value})}
                />

               <textarea type='text' 
                className='form-control ' min='0' 
                placeholder='Enter description'
                value={ad.description}
                onChange={e => setAd({...ad, description: e.target.value})}
                />

                <button onClick={handleClick} className={`btn btn-primary mb-5 m-5 ${ad.loading && `disabled`}`}>
                    {ad.loading ? "Saving..." : "Submit"}
                </button>

                <button onClick={handleDelete} className={`btn btn-danger mb-5 m-5 ${ad.loading && `disabled`}`}>
                    {ad.loading ? "wait..." : "Delete"}
                </button>
            {/* //it is just a format to view the JSOn format on screen */}
            {/* <pre>{JSON.stringify(ad,null,4)}</pre>                                  */}
          </div>
        </>
     );
}
 
export default AdEdit;