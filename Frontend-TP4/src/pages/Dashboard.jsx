import Header from "../components/Header";
import HouseCard from "../components/HouseCard";

import { useEffect, useState } from "react";

import api from "../api/axios";


export default function Dashboard(){


    const [houses,setHouses] = useState([]);



    useEffect(()=>{


        const loadHouses = async()=>{


            try{


                const user =
                    JSON.parse(
                        localStorage.getItem("user")
                    );



                const response =
                    await api.get(
                        `/houses/user/${user.id}`
                    );



                setHouses(response.data);



            }catch(error){

                console.log(error);

            }


        }



        loadHouses();



    },[]);






    return (

        <div className="dashboard-container">


            <Header />



            <h1>

                Mis Hogares

            </h1>



            <div className="house-list">


                {
                    houses.map(house=>(


                        <HouseCard

                            key={house.id}

                            house={house}

                        />


                    ))
                }


            </div>



        </div>

    );


}