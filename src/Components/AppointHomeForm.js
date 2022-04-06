import React, { useRef } from "react";
import "../css/Booking.css";
import { BrowserRouter as Link, useHistory } from "react-router-dom";
import { useAuth } from "../Firebase/AuthContext";
import { useState, useEffect } from "react";
import { db, auth } from "../Firebase/Firebase";
import pincodes from "../Assets/data";
import { AddNewTestForUser, AddNewTestForAdmin } from "../Firebase/Firebase";
import { Modal } from "react-bootstrap";
import { Alert } from "react-bootstrap";

function AppointHomeForm(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { cartItems, onRemove, removeAll } = props;
  const { currentUser, setPaymentConfirmed } = useAuth();

  let total = 0;
  function Add(price) {
    total = parseInt(total) + parseInt(price);
  }
  function Subtract(price) {
    total = parseInt(total) - parseInt(price);
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nameRef = useRef();
  const emailRef = useRef();
  const ageRef = useRef();
  const drnameRef = useRef();
  const phoneRef = useRef();
  const genderRef = useRef();
  const addressRef = useRef();
  const dateRef = useRef();
  const slotRef = useRef();
  const zipcodeRef = useRef();
  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();

    if (pincodes.find((x) => x === parseInt(zipcodeRef.current.value))) {
      try {
        const userInfo = {
          name: nameRef.current.value,
          email: emailRef.current.value,
          age: ageRef.current.value,
          doctorname: drnameRef.current.value,
          phone: phoneRef.current.value,
          gender: genderRef.current.value,
          address: addressRef.current.value,
          date: dateRef.current.value,
          slot: slotRef.current.value,
          zipcode: zipcodeRef.current.value,
          location: "home",
          userId: auth.currentUser.uid,
        };
        cartItems.forEach((item) => {
          AddNewTestForUser(auth.currentUser.uid, item, userInfo);
          AddNewTestForAdmin(auth.currentUser.uid, item, userInfo);
        });
        removeAll();
        setPaymentConfirmed(true);
        console.log(cartItems);
        console.log("after removeall");
        history.push("/");
      } catch (err) {
        console.log(err);
        console.log("this does not works after submit");
      }
    } else {
      console.log("not working");
    }
  }

  const [ProfileInfo, setProfileInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .get();

        console.log("response", response);

        let data = { title: "not found" };

        if (response.exists) {
          console.log("found it");
          data = response.data();
          console.log(data);
        }

        setProfileInfo(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  var today = new Date();
  var dd = String(today.getDate() + 1).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  var max1 = new Date();
  var dd1 = String(max1.getDate()).padStart(2, "0");
  var mm1 = String(max1.getMonth() + 2).padStart(2, "0"); //January is 0!
  var yyyy1 = max1.getFullYear();
  max1 = yyyy1 + "-" + mm1 + "-" + dd1;

  function showModal1(e) {
    e.preventDefault();
    if (pincodes.find((x) => x === parseInt(zipcodeRef.current.value))) {
      setError("");
      handleShow();
    } else {
      setError("Home visit not available for this pincode");
    }
  }

  return (
    <div>
      <div>
        <section className="contact-clean">
          <form
            className="bg-light border rounded"
            onSubmit={showModal1}
            style={{ background: "rgb(248,248,249)" }}
          >
            <h2 className="text-center">Home Visit</h2>
            <div className="form-group mb-3">
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={ProfileInfo.displayName}
                ref={nameRef}
                disabled="true"
              />
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text" for="inputGroupSelect01">
                Gender
              </label>
              {ProfileInfo.gender && (
                <select
                  className="form-select"
                  id="inputGroupSelect01"
                  ref={genderRef}
                  defaultValue={ProfileInfo.gender}
                  required
                >
                  <option value="Choose...">Choose...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              )}
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                type="number"
                name="Age"
                placeholder="Age"
                min="10"
                max="100"
                ref={ageRef}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={currentUser.email}
                disabled="true"
                ref={emailRef}
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                type="number"
                name="phone"
                placeholder="Phone"
                inputMode="tel"
                defaultValue={ProfileInfo.phone}
                required
                ref={phoneRef}
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                type="text"
                name="dr-name"
                placeholder="Ref Doctor's Name"
                ref={drnameRef}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                type="number"
                name="Pincode"
                placeholder="Pincode"
                ref={zipcodeRef}
                defaultValue={ProfileInfo.zipcode}
                required
              />
            </div>
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                name="Address"
                placeholder="Address"
                rows="14"
                ref={addressRef}
                defaultValue={ProfileInfo.address}
              ></textarea>
            </div>

            <div className="d-inline-flex mb-3">
              <input
                className="form-control"
                type="date"
                ref={dateRef}
                min={today}
                max={max1}
                style={{
                  paddingRight: "12px",
                  paddingLeft: "12px",
                  width: "200px",
                }}
                required
              />
            </div>
            <div className="input-group">
              <select
                className="form-select"
                id="inputGroupSelect04"
                aria-label="Example select with button addon"
                ref={slotRef}
                required
              >
                <option selected>Choose Your Slot</option>
                <option value="9-12">9am-12pm</option>
                <option value="12-3">12pm-3pm</option>
                <option value="3-6">3pm-6pm</option>
              </select>
            </div>
            {cartItems.length !== 0 && (
              <div className="form-group mb-3">
                <button className="btn btn-primary" type="submit">
                  Proceed
                </button>
              </div>
            )}
            {cartItems.length === 0 && (
              <div className="form-group mb-3">
                <Link className="btn btn-danger mt-3" to="/AppointmentHome">
                  Select atleast one test
                </Link>
              </div>
            )}

            <div>
              {cartItems.length === 0 && <div>Cart is empty</div>}

              {cartItems.length !== 0 && (
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Test Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>&#x20b9;{item.price}</td>
                              {console.log(total)}
                              {Add(item.price)}
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => {
                                    onRemove(item);
                                    // total = total - item.price;
                                    Subtract(item.price);
                                    console.log(total);
                                  }}
                                >
                                  <i className="far fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        Your total is &#x20b9;{total}
                      </table>
                      {error && <Alert variant="danger">{error}</Alert>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Payment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card credit-card-box">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label className="form-label" for="cardHolder">
                        Card Holder Name{" "}
                      </label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          type="text"
                          id="cardHolder"
                          required
                          placeholder="Card Holder Name"
                        />
                      </div>
                      <label className="form-label" for="cardNumber">
                        Card number{" "}
                      </label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          type="tel"
                          id="cardNumber"
                          required
                          placeholder="Valid Card Number"
                        />
                        <span className="input-group-text">
                          <i className="fa fa-credit-card"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-7">
                    <div className="form-group mb-3">
                      <label className="form-label" for="cardExpiry">
                        <span>Expiration </span>
                      </label>
                      <input
                        className="form-control"
                        type="tel"
                        id="cardExpiry"
                        pattern="(0[1-9]{1}|1[0-2]{1})-([0-9]{4}|[0-9]{2})"
                        required
                        placeholder="MM - YY"
                      />
                    </div>
                  </div>
                  <div className="col-5 pull-right">
                    <div className="form-group mb-3">
                      <label className="form-label" for="cardCVC">
                        CV Code
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="cardCVC"
                        required=""
                        placeholder="CVC"
                        min="111"
                        max="999"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-success btn-lg d-block w-100"
              type="submit"
            >
              Pay Now
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default AppointHomeForm;
