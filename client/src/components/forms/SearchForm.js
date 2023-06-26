import { useNavigate } from 'react-router-dom';
import {useSearch} from '../../context/Search';
import {sellPrices, rentPrices} from '../../helpers/priceList';
import queryString from 'query-string';
import axios from 'axios';


const SearchForm = () => {
    //context
    const [search, setSearch] = useSearch()

    //hook
    const navigate = useNavigate();


    const handleSearch = async() => {
        try{
            setSearch({...search, loading: true});

            const {results, page, price, ...rest} = search;                                      //it means we deselect results page and price.
            const query = queryString.stringify(rest);

            console.log("query is here --> ", query);

            const {data} = await axios.get(`/search?${query}`);

            if(search?.page !== "/search"){
                setSearch((prev) => ({ ...prev, results: data , loading: false }));
                navigate('/search');
            }else{
                setSearch((prev) => ({ 
                    ...prev, 
                    results: data ,
                    page:window.location.pathname,                          //it will give the current page name
                    loading: false }));
            }
        }catch(err){
            console.log(err);
            setSearch({...search, loading: false});
        }
    }


    return ( 
        <div className='search_container'>
           <div className='container m-4'>
                <div className='row'>
                <form className="d-flex" role="search">
                    <input 
                    className="form-control me-2" 
                    type="search" placeholder="Search for address" 
                    aria-label="Search" 
                    onChange={(e) => setSearch({...search, address: e.target.value})}
                    />
                </form>
                </div>

                {/* all buttons */}
                <div className="d-flex justify-content-center mt-3">

                <button 
                className='btn btn-primary col-lg-2 square'
                onClick={() => setSearch({...search, action: 'Buy', price: ""})}
                >
                    {search.action === 'Buy' ? "Buy ✔️" : "Buy"}
                </button>

                <button 
                className='btn btn-primary col-lg-2 square'
                onClick={() => setSearch({...search, action: 'Rent', price: ""})}
                >
                    {search.action === 'Rent' ? "Rent ✔️" : "Rent"}
                </button>

                <button 
                className='btn btn-primary col-lg-2 square'
                onClick={() => setSearch({...search, type: 'House', price: ""})}
                >
                    {search.type === 'House' ? "House ✔️" : "House"}
                </button>

                <button 
                className='btn btn-primary col-lg-2 square'
                onClick={() => setSearch({...search, type: 'Land', price: ""})}
                >
                    {search.type === 'Land' ? "Land ✔️" : "Land"}
                </button>

                <div className="dropdown">
                    <button
                    className="btn btn-primary dropdown-toggle square"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {search?.price ? search?.price : "Select Price"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </button>
                    <ul className="dropdown-menu">
                    {search.action === "Buy" ? (
                        <>
                        {sellPrices?.map((p) => (
                            <li key={p._id}>
                            <a
                                className="dropdown-item"
                                onClick={() =>
                                setSearch({
                                    ...search,
                                    price: p.name,
                                    priceRange: p.array,
                                })
                                }
                            >
                                {p.name}
                            </a>
                            </li>
                        ))}
                        </>
                    ) : (
                        <>
                        {rentPrices?.map((p) => (
                            <li key={p._id}>
                            <a
                                className="dropdown-item"
                                onClick={() =>
                                setSearch({
                                    ...search,
                                    price: p.name,
                                    priceRange: p.array,
                                })
                                }
                            >
                                {p.name}
                            </a>
                            </li>
                        ))}
                        </>
                    )}
                    </ul>
                </div>
                
                <button onClick={handleSearch} className='btn btn-danger col-lg-2 square'>Search</button>
               </div>
           </div>   

           {/* <pre>{JSON.stringify(search, null, 4)}</pre> */}
        </div>
     );
}
 
export default SearchForm;