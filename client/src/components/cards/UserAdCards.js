import {Badge} from 'antd';
import {Link} from 'react-router-dom';
import AdFeatures from './AdFeatures';

const UserAdCards = ({ad}) => {
     
    function formatNumber(x){
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
    }

    return ( 
    <div className="col-lg-4 p-4 gx-4 gy-4">
        <Link to={`/user/ad/${ad?.slug}`}>
        <Badge.Ribbon text={`${ad?.type} for ${ad?.action}`} color={`${ad?.action === "Sell" ? "blue" : "red"}`}>
            <div className="card hoverable shadow">
                <img 
                src={ad?.photos?.[0].Location} 
                alt={`${ad?.type}-${ad?.address}-${ad?.action}`}
                style={{height: "250px", objectFit: "cover"}} />

                <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h5>{`${ad?.type}`}</h5>
                    <h3>Rs. {formatNumber(ad?.price)}/-</h3>
                </div>
                <p>{`${ad?.address}`}</p>

                <AdFeatures ad={ad} />
                </div>
            </div>
        </Badge.Ribbon>
        </Link>
    </div>
        
     );
}
 
export default UserAdCards;