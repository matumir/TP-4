import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import AlertBox from "../components/AlertBox";

export default function House() {

    const { id } = useParams();

    const email =
        localStorage.getItem("email");

    const house = {
        id,
        title: `Casa ${id}`
    };

    const allProducts = [
        {
            id: 1,
            name: "Leche",
            quantity: 2,
            minimumStock: 5,
            categoryId: 1
        },
        {
            id: 2,
            name: "Queso",
            quantity: 8,
            minimumStock: 3,
            categoryId: 1
        },
        {
            id: 3,
            name: "Manteca",
            quantity: 4,
            minimumStock: 2,
            categoryId: 1
        },
        {
            id: 4,
            name: "Fideos",
            quantity: 10,
            minimumStock: 4,
            categoryId: 2
        }
    ];

    const categories = [
        {
            id: 1,
            name: "Lácteos"
        },
        {
            id: 2,
            name: "Almacén"
        }
    ];

    const alerts = [
        "Leche necesita reposición"
    ];

    const [selectedCategory,
        setSelectedCategory] =
        useState(null);

    const filteredProducts =
        selectedCategory === null
            ? allProducts
            : allProducts.filter(
                p =>
                    p.categoryId ===
                    selectedCategory
            );

    return (
        <div>

            <Header email={email} />

            <div className="house-container">

                <h1>
                    Casa: {house.title}
                </h1>

                <h2 className="section-title">
                    Categorías
                </h2>

                <div className="category-list">

                    <button
                        className={`category-card ${
                            selectedCategory === null
                                ? "selected-category"
                                : ""
                        }`}
                        onClick={() =>
                            setSelectedCategory(null)
                        }
                    >
                        Todas ({allProducts.length})
                    </button>

                    {
                        categories.map(category => {

                            const productCount =
                                allProducts.filter(
                                    product =>
                                        product.categoryId === category.id
                                ).length;

                            return (
                                <button
                                    key={category.id}
                                    className={`category-card ${
                                        selectedCategory === category.id
                                            ? "selected-category"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedCategory(
                                            category.id
                                        )
                                    }
                                >
                                    {category.name} ({productCount})
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

                <AlertBox alerts={alerts} />

            </div>

        </div>
    );
}