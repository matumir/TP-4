import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import AlertBox from "../components/AlertBox";


export default function House() {


    const { id } = useParams();


    const email =
        localStorage.getItem("email");



    const [products, setProducts] =
        useState([]);



    const [loading, setLoading] =
        useState(true);



    const [selectedCategory,
        setSelectedCategory] =
        useState(null);





    const loadProducts = async () => {


        try {


            const response =
                await api.get("/products");



            setProducts(
                response.data
            );



        } catch(error) {


            console.log(
                error
            );


        } finally {


            setLoading(false);


        }

    };





    useEffect(()=>{


        loadProducts();


    }, []);







    if(loading){


        return (

            <h2>
                Cargando productos...
            </h2>

        );


    }







    const categories =
        [...new Set(

            products.map(
                product =>
                    product.categoryId
            )

        )];







    const filteredProducts =

        selectedCategory === null

        ?

        products

        :

        products.filter(

            product =>

                product.categoryId ===
                selectedCategory

        );









    return (


        <div>


            <Header email={email}/>





            <div className="house-container">



                <h1>

                    Casa: {id}

                </h1>






                <h2 className="section-title">

                    Categorías

                </h2>





                <div className="category-list">



                    <button

                        className="category-card"

                        onClick={() =>
                            setSelectedCategory(null)
                        }

                    >

                        Todas ({products.length})


                    </button>





                    {

                        categories.map(categoryId => {



                            const amount =

                                products.filter(

                                    product =>

                                    product.categoryId === categoryId

                                ).length;



                            return (

                                <button

                                    key={categoryId}

                                    className="category-card"


                                    onClick={() =>

                                        setSelectedCategory(
                                            categoryId
                                        )

                                    }


                                >

                                    Categoría {categoryId}
                                    {" "}
                                    ({amount})


                                </button>


                            );


                        })

                    }




                </div>







                <h2 className="section-title">

                    Productos

                </h2>





                <div className="product-list">



                    {


                        filteredProducts.map(product => (


                            <ProductCard

                                key={product.id}

                                product={product}


                            />


                        ))



                    }





                </div>








                <h2 className="section-title">

                    Alertas

                </h2>



                <AlertBox

                    alerts={[]}

                />





            </div>



        </div>


    );


}