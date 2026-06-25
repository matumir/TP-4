export default function AlertBox({ alerts }) {
  return (
    <div className="alert-box">

      {
        alerts.length === 0
          ? (
            <p>
              No hay alertas
            </p>
          )
          : (
            alerts.map((alert, index) => (
              <p key={index}>
                {alert}
              </p>
            ))
          )
      }

    </div>
  );
}