import { useState } from "react";

import api from "../api/axios";


export default function StockForm({

    product,
    onClose

}) {


    const [type, setType] =
        useState("ENTRY");


    const [quantity, setQuantity] =
        useState("");


    const [expirationDate, setExpirationDate] =
        useState("");



    const handleSubmit = async (e) => {


        e.preventDefault();



        try {


            const response = await api.post(

                "/movements",

                {

                    type,

                    quantity: Number(quantity),

                    productId: product.id,

                    expirationDate

                }

            );



            console.log(
                "Movimiento creado:",
                response.data
            );



            alert(
                "Stock actualizado correctamente"
            );



            onClose();



        } catch(error) {


            console.log(error);



            alert(
                "Error al modificar stock"
            );


        }


    };




    return (

        <div className="modal-overlay">


            <div className="modal-content">


                <h2>
                    Modificar Stock
                </h2>



                <p className="product-name">

                    Producto:
                    {" "}
                    {product.name}

                </p>




                <form

                    onSubmit={handleSubmit}

                    className="stock-form-content"

                >



                    <label>

                        Tipo de movimiento

                    </label>



                    <select

                        value={type}

                        onChange={(e)=>

                            setType(
                                e.target.value
                            )

                        }

                    >


                        <option value="ENTRY">

                            Ingreso

                        </option>



                        <option value="EXIT">

                            Egreso

                        </option>



                    </select>






                    <label>

                        Cantidad

                    </label>



                    <input

                        type="number"

                        min="1"

                        value={quantity}

                        onChange={(e)=>

                            setQuantity(
                                e.target.value
                            )

                        }

                        required

                    />






                    <label>

                        Fecha de vencimiento

                    </label>



                    <input

                        type="date"

                        value={expirationDate}

                        onChange={(e)=>

                            setExpirationDate(
                                e.target.value
                            )

                        }

                        required

                    />







                    <div className="stock-form-buttons">



                        <button type="submit">

                            Guardar

                        </button>





                        <button

                            type="button"

                            onClick={onClose}

                        >

                            Cancelar

                        </button>



                    </div>





                </form>





            </div>




        </div>

    );


}