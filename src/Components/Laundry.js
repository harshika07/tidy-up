import { React, useState, useEffect } from "react";
import "../css/Services.css";
import { db } from "../Firebase/Firebase";

function Laundry(props) {
  const { onAdd, onRemove, cartItems } = props;

  const [orders, setOrders] = useState([]);

  const getLaundryFromFirebase = [];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Reached inside useEffect");
    const fetchData = async () => {
      try {
        const response = db
          .collection("available_orders")
          .onSnapshot((querySnapshot) => {
            console.log("Collection found");
            querySnapshot.forEach((doc) => {
              console.log(doc);
              if (doc.data().location === "laundry") {
                console.log("laundry found");
                getLaundryFromFirebase.push({
                  ...doc.data(), //spread operator
                  id: doc.id, // `id` given to us by Firebase
                });
              }
              console.log("reached in laundry");
            });
            setOrders(getLaundryFromFirebase);
            console.log(getLaundryFromFirebase);
            setLoading(false);
          });

        console.log("response", response);

        if (response.exists) {
          console.log("found it");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section
        className="features-boxed"
        style={{ fontFamily: "Sora, sans-serif", background: "#e3ebff" }}
      >
        <div className="intro">
          <h2 className="text-center" style={{ color: "#3552c8" }}>
            Per Piece Price
          </h2>
        </div>
        <div className="container">
          <div className="row justify-content-center features">
            {orders.map((order) => (
              <div
                className="col-sm-6 col-md-5 col-lg-4 item"
                key={order.id}
                product={order}
              >
                <div
                  className="box"
                  style={{
                    borderTopColor: "rgb(80,94,108)",
                    borderRadius: "10px",
                  }}
                >
                  <h3 className="name">{order.name}</h3>
                  <p>&#x20b9;{order.price}</p>

                  {!cartItems.find((x) => x.id === order.id) && (
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{
                        fontFamily: "Sora, sans-serif",
                        color: "#ffffff",
                        background: "#3552c8",
                      }}
                      onClick={() => {
                        onAdd(order);
                        console.log(order);
                        console.log(cartItems.length);
                      }}
                    >
                      Add
                    </button>
                  )}
                  {cartItems.find((x) => x.id === order.id) && (
                    <button
                      className="btn btn-danger add"
                      type="button"
                      onClick={() => onRemove(order)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      ;
    </div>
  );
}

export default Laundry;
