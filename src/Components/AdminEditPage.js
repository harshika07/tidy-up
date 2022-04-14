import React, { useRef, useState, useEffect } from "react";
import "../css/Booking.css";
import { Link, useHistory } from "react-router-dom";
import { db, UpdateOrder, CreateOrder } from "../Firebase/Firebase";

function AdminEditPage(props) {
  const { availableOrders } = props;
  console.log(availableOrders.id);
  const OrderName = useRef();
  const Price = useRef();
  const Location = useRef();
  const Description = useRef();
  const history = useHistory();

  function handleUpload(e) {
    e.preventDefault();
    if (availableOrders) {
      UpdateOrder(availableOrders.id, {
        name: OrderName.current.value,
        price: Price.current.value,
        location: Location.current.value,
        description: Description.current.value,
      });
      history.push("/AvailableOrders");
    } else {
      CreateOrder(Location.current.value + OrderName.current.value, {
        name: OrderName.current.value,
        price: Price.current.value,
        location: Location.current.value,
        description: Description.current.value,
      });
      history.push("/AvailableOrders");
    }
  }

  const [orderInfo, setOrderInfo] = useState({});
  useEffect(() => {
    if (availableOrders) {
      const fetchData = async () => {
        try {
          const response = await db
            .collection("available_orders")
            .doc(availableOrders.id)
            .get();

          console.log("response", response);

          let data = { title: "not found" };

          if (response.exists) {
            console.log("found it");
            data = response.data();
            console.log(data);
          }

          setOrderInfo(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    } else {
      console.log("adding new doc");
    }
  }, []);
  return (
    <div>
      <div>
        <section className="contact-clean">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to="/AvailableOrders">Available orders</Link>
              </li>

              <li class="breadcrumb-item active" aria-current="page">
                Admin Edit Page
              </li>
            </ol>
          </nav>
          <form
            className="bg-light border rounded"
            style={{ background: "rgb(248,248,249)" }}
            onSubmit={handleUpload}
          >
            {availableOrders && <h2 className="text-center">Edit order</h2>}
            {!availableOrders && <h2 className="text-center">Add New order</h2>}

            <div className="form-group mb-3">
              <input
                className="form-control"
                type="text"
                name="order name"
                placeholder="order Name"
                ref={OrderName}
                defaultValue={orderInfo.name}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                type="number"
                name="Price"
                placeholder="Price"
                ref={Price}
                defaultValue={orderInfo.price}
                required
              />
            </div>
            {orderInfo && (
              <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupSelect01">
                  Location
                </label>
                <select
                  class="form-select"
                  ref={Location}
                  defaultValue={availableOrders.location}
                  id="inputGroupSelect01"
                  required
                >
                  <option value="dryclean">DryClean</option>
                  <option value="wash">Wash</option>
                  <option value="iron">Iron</option>
                  <option value="laundry">Laundry</option>
                </select>
              </div>
            )}
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                name="Description"
                placeholder="Description"
                rows="14"
                ref={Description}
                defaultValue={orderInfo.description}
              ></textarea>
            </div>
            <div className="form-group mb-3">
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminEditPage;
