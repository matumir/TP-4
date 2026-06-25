export default function HouseCard({ house, onClick }) {
  return (
    <button
      className="house-card"
      onClick={onClick}
    >
      <h3>{house.title}</h3>

      <p>
        ID: {house.id}
      </p>
    </button>
  );
}