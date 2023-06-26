import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from '../../context/auth';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';



const Settings = () => {
    //context
    const [auth, setAuth] = useAuth();

    //state
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);



    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const {data} = await axios.put('/update-password', { password })

            if(data?.error){
                toast.error(data.error);
                setLoading(false);
            }else{
                toast.success("Password Updated !!!");
                setLoading(false);
            }
        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }


    return ( 
        <>
            <h1 className="bg-primary text-light p-5 display-1">
                Settings
            </h1>
            <div className="container-fluid">
                <Sidebar />
                <div className="mt-2 container">
                    <div className='row'>
                        <div className='col-lg-8 offset-lg-2 mt-2'>

                            <form onSubmit={handleSubmit}>
                                <h3 className="text-center mt-4 mb-4">Update Your Password</h3>

                              {/* password */}
                              <input type='password' 
                                placeholder='Enter Your Password'
                                className='form-control mb-4 mt-4'
                                value={password}                                                      
                                onChange={(e) => setPassword(e.target.value)}         
                              />

                              <button className='btn btn-danger col-12 mb-5' disabled={loading}>
                                {loading ? "Updating..." : "Update Password"}
                              </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default Settings;