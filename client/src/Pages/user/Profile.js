import slugify from 'slugify'
import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from '../../context/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileUpload from '../../components/forms/ProfileUpload';
import axios from 'axios';
import { toast } from 'react-hot-toast';



const Profile = () => {
    //context
    const [auth, setAuth] = useAuth();

    //state
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);

    //hook
    const navigate = useNavigate();

    useEffect(()=> {
        if(auth.user){
            setUsername(auth.user?.username);
            setName(auth.user?.name);
            setEmail(auth.user?.email);
            setAddress(auth.user?.address);
            setPhone(auth.user?.phone);
            setCompany(auth.user?.company);
            setAbout(auth.user?.about);
            setPhoto(auth.user?.photo);
        }
    }, [])


    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const {data} = await axios.put('/update-profile', {
                username, email, name, phone, photo, about, company, address
            })

            if(data?.error){
                toast.error(data.error);
                setLoading(false);
            }else{
                setAuth({...auth, user: data})
                toast.success("Profile Updated successfully !!!");
                console.log("Update profile response fom server --> ", data);
                setLoading(false);


                //update localstorage
                let fromLS = JSON.parse(localStorage.getItem("auth"));
                fromLS.user = data;
                localStorage.setItem("auth", JSON.stringify(fromLS));
            }
        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }


    return ( 
        <>
            <h1 className="bg-primary text-light p-5 display-1">
                Profile
            </h1>
            <div className="container-fluid">
                <Sidebar />
                <div className="mt-2 container">
                    <div className='row'>
                        <div className='col-lg-8 offset-lg-2 mt-2'>

                            <ProfileUpload 
                            photo={photo}
                            setPhoto={setPhoto} 
                            uploading={uploading} 
                            setUploading={setUploading} 
                            />

                            <form onSubmit={handleSubmit}>
                                {/* //username */}
                              <input type='text' 
                                placeholder='Update Your Username'
                                className='form-control mb-4'
                                value={username}                                                      //it will show the existing username
                                onChange={(e) => setUsername(slugify(e.target.value.toLowerCase()))}          //slugify will remove white space, "Prateek Rai" => "PrateekRai"
                              />
                              {/* name */}
                              <input type='text' 
                                placeholder='Enter Your Name'
                                className='form-control mb-4'
                                value={name}                                                      
                                onChange={(e) => setName(e.target.value)}         
                              />

                              {/* email */}
                              <input type='email' 
                                className='form-control mb-4'
                                value={email}     
                                disabled={true}                                                         
                              />

                              {/* company name */}
                              <input type='text' 
                                placeholder='Enter Your Company Name'
                                className='form-control mb-4'
                                value={company}                                                      
                                onChange={(e) => setCompany(e.target.value)}         
                              />

                              {/* address */}
                              <input type='text' 
                                placeholder='Enter Your Address'
                                className='form-control mb-4'
                                value={address}                                                      
                                onChange={(e) => setAddress(e.target.value)}         
                              />

                                {/* phone number */}
                                <input type='text' 
                                placeholder='Enter Your Number'
                                className='form-control mb-4'
                                value={phone}                                                      
                                onChange={(e) => setPhone(e.target.value)}         
                              />

                              {/* about */}
                              <textarea  
                                placeholder='About yourself'
                                className='form-control mb-4'
                                value={about}                                                      
                                onChange={(e) => setAbout(e.target.value)}      
                                maxLength={200}   
                              />

                              <button className='btn btn-primary col-12 mb-5' disabled={loading}>
                                {loading ? "Updating..." : "Update the profile"}
                              </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default Profile;