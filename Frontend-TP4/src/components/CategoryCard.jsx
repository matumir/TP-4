export default function CategoryCard({
  category,
  onClick
}) {
  return (
    <button
      className="category-card"
      onClick={onClick}
    >

      <h3>
        {category.name}
      </h3>

      <p>
        Productos: {category.productCount}
      </p>

    </button>
  );
}