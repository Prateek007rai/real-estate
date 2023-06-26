import {useState, useEffect, createContext, useContext} from 'react';


const SearchConetxt =  createContext();

const initialState = {
    address: '',
    action: "Buy",
    type: 'House',
    price: '',
    priceRange: [0,1000000],
    result: [],
    page: '',
    loading: false
}

const SearchProvider = ({children}) => {
    const [search, setSearch] = useState(initialState);

    return (
        <SearchConetxt.Provider value={[search, setSearch, initialState]}>
            {children}
        </SearchConetxt.Provider>
    )
};

const useSearch = () => useContext(SearchConetxt);

export {useSearch, SearchProvider};