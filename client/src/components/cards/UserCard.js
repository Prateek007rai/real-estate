import {Badge} from 'antd';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import axios from 'axios';

dayjs.extend(relativeTime);  

const UserCard = ({user}) => {
     
   const [count, setCount] = useState(0);

   useEffect(()=>{
    if(user?._id){
        fetchAdCount();
    }
   }, [user?._id])

   const fetchAdCount = async() => {
    try{
        const {data} = await axios.get(`/agent-ad-count/${user?._id}`);
        setCount(data.length);
    }catch(err){
        console.log(err);
    }
   }

    return ( 
    <div className="col-lg-4 p-4 gx-4 gy-4">
        <Link to={`/agent/${user?.username}`}>
        <Badge.Ribbon text={`${count} listings`} color="red">
            <div className="card hoverable shadow">
                <img 
                src={user?.photo?.Location} 
                alt={user.username}
                style={{height: "250px", objectFit: "cover"}} />

                <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h5>{user?.name ? user.name : user?.username}</h5>
                </div>
                <p>{user.email}</p>
                <p>Joined {dayjs(user.createdAt).fromNow()}</p>

                </div>
            </div>
        </Badge.Ribbon>
        </Link>
    </div>
        
     );
}
 
export default UserCard;