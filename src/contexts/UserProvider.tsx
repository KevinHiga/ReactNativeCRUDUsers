import React, { createContext, useContext, useEffect, useState } from 'react';
type dataType = {
    id: string;
    dni: string;
    firstName: string;
    lastName: string;
    civilStatus: string;
    birthDate: Date;
    cityId: string;
    email: string;
    phone: string;
};
type dataTypeCity = {
    key: string;
    value: string;
};

const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [users, setUsers] = useState<dataType[]>([]);
    const [citys, setCitys] = useState<dataTypeCity[]>([]);
    const [filterUsers, setFilterUsers] = useState<dataType[]>([]);
    const [temp, setTemp] = useState<dataType[]>([]);
    const [resultNotFound, setResultNotFound] = useState(false);
  
    const findUsers = async () => {
      const url = "http://192.168.1.40:6000/users"
      fetch(url)
          .then(res=>res.json())
          .then((result) => {
              setUsers(result.data.data);
              setFilterUsers(result.data.data)
          }, (error) => {
            setResultNotFound(true);
          })
    };
  
    const findCitys = async () => {
      const url = "http://192.168.1.40:6000/citys"
      fetch(url)
          .then(res=>res.json())
          .then((result) => {
            setCitys(result.data.data);
          }, (error) => {
            setResultNotFound(true);
          })
    };
  
    useEffect(() => {
      findUsers();
      findCitys();
    }, [temp]);

  return (
    <UserContext.Provider value={{ users, setUsers, findUsers, filterUsers, setFilterUsers, resultNotFound, setResultNotFound, setTemp, findCitys, citys, setCitys }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);

export default UserProvider;