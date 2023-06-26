import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import {Avatar} from "antd";
import { useAuth } from '../../context/auth';

const ProfileUpload = ({photo, setPhoto, uploading, setUploading}) => {

    //context
    const [auth, setAuth]  = useAuth();

    const handleUpload = async(e) => {
        try{
            let file = e.target.files[0];

            if(file){
                console.log("==From profile upload===>>", file)
                setUploading(true);

                new Promise(() => {
                    Resizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
                    async(uri) => {
                        try{
                            // console.log("UPLOAD URI ---> ", uri)
                            const {data} = await axios.post('/upload-image', {
                                image: uri
                            })
                            setPhoto(data);
                            setUploading(false);
                        }catch(err){
                            console.log(err);
                            setUploading(false);
                        }
                    },
                    'base64'
                    )
                })              
            }
        }catch(err){
            console.log(err);
            setUploading(false);
        }
    }

    const handleDelete = async() => {
        const ans = window.confirm("Delete Image ?");
        if(!ans) return;
        setUploading(true);
        try{
            const {data} = await axios.post('/remove-image', photo);
            console.log("Photo delete value -----> ", data);
            if(data){
                setPhoto(null);
                setUploading(false);
            }
        }catch(err){
            console.log(err);
            setUploading(false);
        }
    }

    return ( 
        <>
        <input 
         className="form-control mt-5 mb-4"
         onChange={handleUpload} type="file" 
         accept="image/*" 
         //multiple                                                           //bcz single pic will upload
        />
        {uploading && (<div className='upl_notify'>Wait ...</div>)}

        {photo?.Location ? 
          <Avatar shape='square'
            src={photo?.Location}
            className='mx-1 profile_image'
             size="20" 
             onClick={()=>handleDelete()}
          />
          : " "
        }
        
        <div className='upl_notify mt-2 mb-4'>{photo?.Location && "Click the Image to delete"}</div>
        </>
     );
}
 
export default ProfileUpload;