import AdForm from "../../../components/forms/AdForm";
import Sidebar from "../../../components/nav/Sidebar";


const RentHouse = () => {
    return ( 
        <div>
            <h1 className="bg-primary text-light p-5 display-1">
              Rent House
            </h1> 
            <Sidebar />
            <div className="container mt-2">
                <AdForm action="Remt" type="House"/>
            </div>
        </div>
     );
}
 
export default RentHouse;