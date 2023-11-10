import React, { createContext, useContext, useEffect, useState } from 'react';
type dataType = {
    key: string;
    value: string;
};

const CityContext = createContext();
const CityProvider = ({ children }) => {
    const [citys, setCitys] = useState<dataType[]>([]);
    const [filterCitys, setFilterCitys] = useState<dataType[]>([]);
    const [temp, setTemp] = useState<dataType[]>([]);
    const [resultNotFound, setResultNotFound] = useState(false);
  
    const findCitys = async () => {
      const url = "http://192.168.1.40:6000/citys"
      fetch(url)
          .then(res=>res.json())
          .then((result) => {
              setCitys(result.data.data);
              setFilterCitys(result.data.data)
          }, (error) => {
            setResultNotFound(true);
          })
    };
  
    useEffect(() => {
      findCitys();
    }, [temp]);

  return (
    <CityContext.Provider value={{ citys, setCitys, findCitys, filterCitys, setFilterCitys, resultNotFound, setResultNotFound, setTemp }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCitys = () => useContext(CityContext);

export default CityProvider;