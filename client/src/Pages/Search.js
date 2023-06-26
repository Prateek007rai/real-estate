import AdCards from "../components/cards/AdCards";
import SearchForm from "../components/forms/SearchForm";
import { useSearch } from "../context/Search";

const Search = () => {
    //context
    const [search, setSearch] = useSearch();   

    return (
        <div>
            <h1 className="bg-primary text-light p-5 display-1">Search Ad</h1>
            <SearchForm />

            <div className="container">
                <div className="row">
                    {search?.results?.length > 0 ? 
                    <div className="col-md-12 text-center p-5">
                        <h5 className="text-muted"> Found {search.results?.length} ads for You</h5>
                    </div> 
                    : 
                    <div className="col-md-12 text-center p-5 text-muted"> No Properties found </div>}
                </div>

                <div className="row">
                    {search.results?.map((ad) =>
                      <AdCards ad={ad} key={ad._id} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search;