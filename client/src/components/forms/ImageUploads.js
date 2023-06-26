import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import {Avatar} from "antd";

const ImageUpload = ({ad,setAd}) => {

    const handleUpload = async(e) => {
        try{
            let files = e.target.files;
            files = [...files];
            if(files?.length){
              console.log("=====>>", files)
              setAd({...ad, uploading: true})

              files.map(file => {
                new Promise(() => {
                    Resizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
                    async(uri) => {
                        try{
                            // console.log("UPLOAD URI ---> ", uri)
                            const {data} = await axios.post('/upload-image', {
                                image: uri
                            })
                            setAd((prev) => ({
                                ...prev,
                                photos: [data, ...prev.photos],
                                uploading: false
                            }))
                        }catch(err){
                            console.log(err);
                            setAd({...ad, uploading: false})
                        }
                    },
                    'base64'
                    )
                })
              })
            }
        }catch(err){
            console.log(err);
            setAd({...ad, uploading: false})
        }
    }

    const handleDelete = async(file) => {
        const ans = window.confirm("Delete Image ?");
        if(!ans) return;
        setAd({...ad, uploading: true})
        try{
            const {data} = await axios.post('/remove-image', file);
            console.log("File delete value -----> ", data);
            if(data){
                setAd((prev) => ({...prev, 
                    photos: prev.photos.filter((p)=> p.Key !== file.Key),
                    uploading: false
                }))
            }
        }catch(err){
            console.log(err);
            setAd({...ad, uploading: false})
        }
    }

    return ( 
        <>
        <input className="form-control mt-5" onChange={handleUpload} type="file" accept="image/*" multiple />
         {ad.uploading && (<div className='upl_notify'>Wait ...</div>)}
        {ad.photos?.map((file , index) => (
            <Avatar shape='square' key={index} src={file?.Location} className='mx-1 upl_image' size="20" onClick={()=>handleDelete(file)} />
        ))}
        <div className='upl_notify mt-2'>{ad.photos.length > 0 && "Click the Image to delete"}</div>
        </>
     );
}
 
export default ImageUpload;