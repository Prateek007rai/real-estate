import AdForm from "../../../components/forms/AdForm";
import Sidebar from "../../../components/nav/Sidebar";


const SellHouse = () => {
    return ( 
        <div>
            <h1 className="bg-primary text-light p-5 display-1">
              Sell House
            </h1> 
            <Sidebar />
            <div className="container mt-2">
                <AdForm action="Sell" type="House"/>
            </div>
        </div>
     );
}
 
export default SellHouse;