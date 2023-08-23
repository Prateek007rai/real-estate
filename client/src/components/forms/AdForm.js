import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import CurrencyInput from 'react-currency-input-field';
import ImageUpload from './ImageUploads';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {nanoid} from 'nanoid';
import {useAuth} from '../../context/auth';

//action is sell or rent, type = House/Land
const AdForm = ({action, type}) => {

    //conetxt
    const [auth, setAuth] = useAuth()

    //hook
    const navigate = useNavigate();

    const [ad, setAd] = useState({
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
        type,                         //this type & action came from props
        action
    })

    const handleClick = async() => {
        try{
           setAd({ ...ad, loading: true });
           console.log("ad data sended to server", ad );
           const {data} = await axios.post('/ad', ad);

           console.log("ad create response : ", data );

           if(data?.error){
            toast.error(data.error);
            setAd({ ...ad, loading: false });
           }else{

            //data {user, ad}

            //update auth context
            setAuth({...auth, user: data.user});

            //updte localStorage
            const fromLS = JSON.parse(localStorage.getItem("auth"));
            fromLS.user = data.user;
            localStorage.setItem("auth", JSON.stringify(fromLS));

            toast.success("Successfully ad created");
            setAd({ ...ad, loading: false });

            // navigate('/dashboard');
            window.location.href = '/dashboard';
           }
        }catch(err){
            console.log("Error in submiting the form ---->",err)
            setAd({ ...ad, loading: false });
        }
    }



    //address using pin code
    const API_KEY = "AIzaSyAeaI1gkovXnm4yY1AzN97XOmcf1db5aAo";
  const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");

  const handlePinCodeChange = (event) => {
    setPinCode(event.target.value);
  };

  const handleLookupAddress = async() => {
     axios
      .get(BASE_URL, {
        params: {
          address: pinCode,
          key: API_KEY,
        },
      })
      .then((response) => {
        const data = response.data;
        const results = data.results;
        console.log("---->", response, data)
        if (results.length > 0) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress("Address not found.");
        }
      })
      .catch((error) => {
        console.error("Error occurred while fetching data.", error);
      });
  };


    return ( 
        <>
          <div className='mb-0'>

            <ImageUpload ad={ad} setAd={setAd}/>

            {/* <GooglePlacesAutocomplete 
            apiKey={"AIzaSyCf9nW0AlM4aphUHhb10x8VsfzYKNTLQAw"}
            apiOptions="in"
            selectProps = {
                {defaultInputValue: ad?.address,
                 placeholder: "Search for address...",
                onChange:({value})=> {
                    setAd({...ad, address: value.description})
                }}}
            /> */}

                <input type='text' 
                className='form-control mb-3 mt-5' min='0' 
                placeholder='Enter address'
                value={ad.address}
                onChange={e => setAd({...ad, address: e.target.value})}
                />

    <div>
      <h1>Pin Code to Address Converter</h1>
      <div>
        <input
          type="text"
          value={pinCode}
          onChange={handlePinCodeChange}
          placeholder="Enter Pin Code"
        />
        <button onClick={handleLookupAddress} className='mt-5 mb-5'>Lookup Address</button>
      </div>
      <div>
        <p>Address: {address}</p>
      </div>
    </div>

                <CurrencyInput
                 className='form-control mb-3'
                placeholder="Please enter Price"
                defaultValue={ad.price}
                decimalsLimit={2}
                onValueChange={(value) => setAd({...ad, price: value})}
                />

                {type === "House" ? 
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
                className='form-control mb-5' min='0' 
                placeholder='Enter description'
                value={ad.description}
                onChange={e => setAd({...ad, description: e.target.value})}
                />

                <button onClick={handleClick} className={`btn btn-warning mb-5 ${ad.loading && `disabled`}`}>
                    {ad.loading ? "Saving..." : "Submit"}
                </button>

            {/* //it is just a format to view the JSOn format on screen */}
            {/* <pre>{JSON.stringify(ad,null,4)}</pre>                                  */}
          </div>
        </>
     );
}
 
export default AdForm;