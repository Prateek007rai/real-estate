import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/cards/UserCard";


const Agents = () => {

    //state
    const [agents, setAgents] = useState();
    const [laoding, setLoading] = useState(true);


    useEffect(() => { fetchAgents(); } ,[]);

    const fetchAgents = async() => {
       try{
        const {data} = await axios.get('/agents');

        setAgents(data);
        setLoading(false);
       }catch(err){
        console.log(err);
        setLoading(false);
       }
    }


    return (
        <div>
            <h1 className="bg-primary text-light p-5 display-1">Agents</h1>

            <div className="container">
                <div className="row">
                    {agents?.map((agent)=>(
                      <UserCard key={agent._id} user={agent} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Agents;