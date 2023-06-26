import AdForm from "../../../components/forms/AdForm";
import Sidebar from "../../../components/nav/Sidebar";


const RentLand = () => {
    return ( 
        <div>
            <h1 className="bg-primary text-light p-5 display-1">
              Rent Land
            </h1> 
            <Sidebar />
            <div className="container mt-2">
                <AdForm action="Rent" type="Land"/>
            </div>
        </div>
     );
}
 
export default RentLand;