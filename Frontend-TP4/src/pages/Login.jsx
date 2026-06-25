import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


export default function Login(){


    const navigate = useNavigate();


    const [username,setUsername] =
        useState("");


    const [password,setPassword] =
        useState("");



    const [error,setError] =
        useState("");





    const handleLogin = async (e)=>{


        e.preventDefault();


        try{


            const response = await api.post(

                "/users/login",

                {

                    username,

                    password

                }

            );



            console.log(
                response.data
            );



            // guardamos el usuario logueado
            // para usarlo después en el dashboard

            localStorage.setItem(

                "user",

                JSON.stringify(
                    response.data.user
                )

            );



            navigate("/dashboard");




        }catch(error){


            console.log(error);



            setError(

                "Usuario o contraseña incorrectos"

            );


        }


    };







    return (


        <div className="login-container">


            <div className="login-card">



                <h1>

                    Stock Hogar

                </h1>





                <form

                    onSubmit={handleLogin}

                >




                    <input


                        type="text"


                        placeholder="Usuario"


                        value={username}


                        onChange={(e)=>

                            setUsername(
                                e.target.value
                            )

                        }


                        required


                    />





                    <input


                        type="password"


                        placeholder="Contraseña"


                        value={password}


                        onChange={(e)=>

                            setPassword(
                                e.target.value
                            )

                        }


                        required


                    />






                    {
                        error && (

                            <p>

                                {error}

                            </p>

                        )
                    }






                    <button>

                        Login

                    </button>





                </form>





            </div>




        </div>


    );


}