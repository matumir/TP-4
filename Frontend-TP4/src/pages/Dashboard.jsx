import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import HouseCard from "../components/HouseCard";

export default function Dashboard() {

    const navigate = useNavigate();

    const email =
        localStorage.getItem("email");

    const houses = [
        {
            id: 1,
            title: "Casa 1"
        },
        {
            id: 2,
            title: "Casa 2"
        }
    ];

    return (
        <div>

            <Header
                email={email}
            />

            <div className="dashboard-container">

                <h1>
                    Mis Hogares
                </h1>

                <div className="house-list">

                    {
                        houses.map((house) => (

                            <HouseCard
                                key={house.id}
                                house={house}
                                onClick={() =>
                                    navigate(
                                        `/house/${house.id}`
                                    )
                                }
                            />

                        ))
                    }

                </div>

            </div>

        </div>
    );
}