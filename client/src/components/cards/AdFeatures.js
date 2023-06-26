import { IoBedOutline } from 'react-icons/io5';
import { TbBath } from 'react-icons/tb';
import { BiArea } from 'react-icons/bi';


const AdFeatures = ({ad}) => {
    return ( 
        <div>
            <p className='d-flex card-text justify-content-between'>
                    {ad?.bedrooms ? (<span> <IoBedOutline /> {ad.bedrooms}</span>) : ''}
                    {ad?.bathrooms ? (<span> <TbBath /> {ad.bathrooms}</span>) : ''}
                    {ad?.landsize ? (<span> <BiArea /> Area: {ad.landsize}</span>) : ''}
            </p>
        </div>
     );
}
 
export default AdFeatures;