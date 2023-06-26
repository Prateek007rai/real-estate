import AdForm from "../../../components/forms/AdForm";
import Sidebar from "../../../components/nav/Sidebar";


const SellLand = () => {
    return ( 
        <div>
            <h1 className="bg-primary text-light p-5 display-1">
              Sell Land
            </h1> 
            <Sidebar />
            <div className="container mt-2">
                <AdForm action="Sell" type="Land"/>
            </div>
        </div>
     );
}
 
export default SellLand;