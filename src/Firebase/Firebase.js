import "firebase/auth";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

import { config } from "./Config";

const app = firebase.initializeApp(config);

export const auth = app.auth();
export const firestore = app.firestore();
export const db = firebase.firestore();
export const storage = app.storage();

// const GoogleProvider = new firebase.auth.GoogleAuthProvider();
// GoogleProvider.setCustomParameters({ prompt: "select_account" });
// export const signInWithGoogle = () => auth.signInWithPopup(GoogleProvider);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export async function updateUser(userId, user) {
  try {
    console.log(userId);
    // console.log("this is new stuff");
    await db.collection("users").doc(userId).update(user);
    // console.log(`Successfully updated user ${userId}`);
  } catch (err) {
    console.error(err);
  }
}

export async function createUser(userId, user) {
  try {
    // console.log("creating user with " + userId);
    await db.collection("users").doc(userId).set(user);
  } catch (err) {
    console.error(err);
  }
}

export async function AddNewOrderForUser(
  userId,
  OrderInfo,
  quantity,
  location,
  userInfo
) {
  try {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    await db
      .collection("users")
      .doc(userId)
      .collection("orders")
      .doc(userId + time + OrderInfo.name)
      .set(userInfo, OrderInfo, quantity, location);
    await db
      .collection("users")
      .doc(userId)
      .collection("orders")
      .doc(userId + time + OrderInfo.name)
      .update({
        ordername: OrderInfo.name,
        quantity: quantity,
        location: location,
      });
    // console.log(response);
    // console.log("this worked in users");
  } catch (err) {
    console.error(err);
  }
}

export async function AddNewOrderForAdmin(
  userId,
  OrderInfo,
  quantity,
  location,
  userInfo
) {
  try {
    // console.log("creating doc with " + userId);
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    await db
      .collection("current_orders")
      .doc(userId + time + OrderInfo.name)
      .set(userInfo, OrderInfo, location, quantity);

    await db
      .collection("current_orders")
      .doc(userId + time + OrderInfo.name)
      .update({
        ordername: OrderInfo.name,
        quantity: quantity,
        location: location,
      });
  } catch (err) {
    console.error(err);
  }
}

export async function CreateOrder(docId, data) {
  try {
    // console.log("creating data with " + docId);
    await db.collection("available_orders").doc(docId).set(data);
  } catch (err) {
    console.error(err);
  }
}

export async function UpdateOrder(docId, data) {
  try {
    console.log("updating data with " + docId);
    await db.collection("available_orders").doc(docId).update(data);
  } catch (err) {
    console.error(err);
  }
}

export async function MakeAdmin(userId) {
  try {
    // console.log(userId);
    // console.log("this is new stuff");
    await db.collection("users").doc(userId).update({ role: "admin" });
    // console.log(`Successfully updated user ${userId}`);
  } catch (err) {
    console.error(err);
  }
}
