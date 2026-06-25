import { useNavigate } from "react-router-dom";


export default function HouseCard({house}){


    const navigate = useNavigate();



    return (


        <div className="house-card">


            <button

                onClick={()=>


                    navigate(
                        `/house/${house.id}`
                    )


                }


            >


                <h3>

                    {house.name}

                </h3>



                <p>

                    ID: {house.id}

                </p>


            </button>



        </div>


    );


}