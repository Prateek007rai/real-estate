import axios from 'axios';
import {useAuth} from '../../context/auth';
import {FcLike, FcLikePlaceholder} from 'react-icons/fc';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';


const LikeUnlike = ({ad}) => {
    //conetxt
    const [auth, setAuth] = useAuth();
    //hooks
    const navigate = useNavigate();

    //like function
    const handleLike = async() => {
        try{
            if(auth.user === null){
                navigate('/login', { state: `/ad/${ad?.slug}`});
                return;
            }
            const {data} = await axios.post(`/wishlist` , {adId: ad._id});                      //passed as params
            // console.log("data after liking ", data, auth);
            setAuth({...auth, user: data});

            //localstorage update
             const fromLS = JSON.parse(localStorage.getItem("auth"));                           //took out the present "auth" data in local storage for updation
            // console.log("......>>>>", fromLS.user);
             fromLS.user = data;
             localStorage.setItem("auth", JSON.stringify(fromLS));

            // console.log("----->", auth);
            toast.success("Addedd to Wishlist !!!");
        }catch(err){
          console.log(err);
        }
    }

    //Unlike function
    const handleUnlike = async() => {
        try{
            //if user is not login then send him to login page
            if(auth.user === null){
                navigate('/login', { state: `/ad/${ad?.slug}`});
                return;
            }
            const {data} = await axios.delete(`/wishlist/${ad._id}`);                      //passed in body
            setAuth({...auth, user: data});
            // console.log("data after unliking ", data, auth);

            //localstorage update
            const fromLS = JSON.parse(localStorage.getItem("auth"));                           //took out the present "auth" data in local storage for updation
            fromLS.user = data;
            localStorage.setItem("auth", JSON.stringify(fromLS));

            toast.success("Removed from Wishlist !!!");
        }catch(err){
          console.log(err);
        }
    }

    return ( 
    <>
       {auth.user?.wishlist?.includes(ad?._id) ? 
       <span><FcLike onClick={handleUnlike} className='h3 pointer'/></span> 
       : <span><FcLikePlaceholder onClick={handleLike} className='h3 pointer' /></span> }
    </> );
}
 
export default LikeUnlike;