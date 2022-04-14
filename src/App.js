import Header from "./Components/Header";
import Home from "./Components/Home";
import Footer from "./Components/Footer";

import ShippingForm from "./Components/ShippingForm";
import AboutUs from "./Components/AboutUs";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ProfilePage from "./Components/ProfilePage";
import ProfileUpdate from "./Components/ProfileUpdate";
import ForgotPass from "./Components/ForgotPass";
import AdminPanel from "./Components/AdminPanel";
import AvailableTestsTable from "./Components/AvailableTestsTable";
import UserTable from "./Components/UserTable";
import CurrentTestsTable from "./Components/CurrentTestsTable";
import AdminTable from "./Components/AdminTable";
import Services from "./Components/Services";
import DryClean from "./Components/DryClean";
import Iron from "./Components/Iron";
import Wash from "./Components/Wash";
import Laundry from "./Components/Laundry";

import AdminEditPage from "./Components/AdminEditPage";

import NotFound from "./Components/NotFound";
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./Firebase/AuthContext";
import PrivateRoute from "./Router/PrivateRoute";
import AdminRoute from "./Router/AdminRoute";

import { db } from "./Firebase/Firebase";
import "../src/css/Footer.css";

function App() {
  let Homepage = "/";

  let Shipping_Form = "/ShippingForm";
  let Service_Page = "/Services";
  let DryClean_Page = "/dryclean";
  let Laundry_Page = "/laundry";
  let Wash_Page = "/wash";
  let Iron_Page = "/iron";
  let About_Us = "/AboutUs";

  let Register_User = "/Register";
  let Login_User = "/Login";
  let Profilepage = "/ProfilePage";
  let Profile_Update = "/ProfileUpdate";
  let Forgot_Pass = "/ForgotPass";
  let admin_panel = "/Admin";
  let Admin_AvailabeTests_table = "/AvailableTests";

  let Admin_CurrentTests_table = "/CurrentTests";
  let Admin_Edit_Page = "/AdminEditPage";
  let Users_Table = "/UsersPage";
  let Admin_Table = "/AdminTable";

  const [role, setRole] = useState("user");
  const getRole = async (userId) => {
    try {
      const response = await db.collection("users").doc(userId).get();

      console.log("response", response);

      let data = { title: "not found" };

      if (response.exists) {
        console.log("found it");
        data = response.data("role");
        console.log("inside " + data);
      }

      setRole(data);
      console.log("changed role to" + role);
    } catch (err) {
      console.error(err);
    }
  };

  const [availableOrders, setAvailableOrders] = useState([]);
  const addOrder = (order) => {
    console.log("insode addTest method");
    setAvailableOrders(order);
  };
  const [currentOrders, setcurrentOrders] = useState([]);
  const addcurrentOrders = (order) => {
    console.log("insode addTest method for currentOrders");
    setcurrentOrders(order);
  };

  const [cartItems, setCartItems] = useState([]);
  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);

    if (exist) {
      console.log("yup now its right");
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
      console.log(cartItems);
    } else {
      console.log("landed in wrong block");
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };

  const removeAll = () => {
    console.log("inside remove all");
    setCartItems([]);
    console.log(cartItems);
  };

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header cartItems={cartItems} />
          <Switch>
            <Route exact path={Homepage}>
              <Home />
            </Route>
            <Route exact path={Service_Page}>
              <Services
                onAdd={onAdd}
                onRemove={onRemove}
                cartItems={cartItems}
                removeAll={removeAll}
              />
            </Route>
            <Route exact path={Laundry_Page}>
              <Laundry
                onAdd={onAdd}
                onRemove={onRemove}
                cartItems={cartItems}
                removeAll={removeAll}
              />
            </Route>
            <Route exact path={Iron_Page}>
              <Iron
                onAdd={onAdd}
                onRemove={onRemove}
                cartItems={cartItems}
                removeAll={removeAll}
              />
            </Route>
            <Route exact path={DryClean_Page}>
              <DryClean
                onAdd={onAdd}
                onRemove={onRemove}
                cartItems={cartItems}
                removeAll={removeAll}
              />
            </Route>
            <Route exact path={Wash_Page}>
              <Wash
                onAdd={onAdd}
                onRemove={onRemove}
                cartItems={cartItems}
                removeAll={removeAll}
              />
            </Route>
            <Route exact path={Shipping_Form}>
              <ShippingForm
                onAdd={onAdd}
                onRemove={onRemove}
                cartItems={cartItems}
                removeAll={removeAll}
              />
            </Route>
            <Route exact path={About_Us}>
              <AboutUs />
            </Route>
            <Route exact path={Register_User}>
              <Register />
            </Route>
            <Route exact path={Login_User}>
              <Login role={role} setRole={getRole} />
            </Route>

            <PrivateRoute
              exact
              path={Profilepage}
              component={ProfilePage}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path={Profile_Update}
              component={ProfileUpdate}
            ></PrivateRoute>
            <Route exact path={Forgot_Pass} component={ForgotPass}></Route>
            <AdminRoute
              exact
              path={admin_panel}
              component={AdminPanel}
            ></AdminRoute>
            <PrivateRoute exact path={Admin_AvailabeTests_table}>
              <AvailableTestsTable
                availableOrders={availableOrders}
                addTest={addOrder}
              />
            </PrivateRoute>
            <PrivateRoute exact path={Admin_CurrentTests_table}>
              <CurrentTestsTable
                currentOrders={currentOrders}
                addcurrentOrders={addcurrentOrders}
              />
            </PrivateRoute>
            <PrivateRoute exact path={Admin_Edit_Page}>
              <AdminEditPage
                availableOrders={availableOrders}
                addTest={addOrder}
              />
            </PrivateRoute>
            <PrivateRoute exact path={Users_Table}>
              <UserTable />
            </PrivateRoute>
            <PrivateRoute exact path={Admin_Table}>
              <AdminTable />
            </PrivateRoute>
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
