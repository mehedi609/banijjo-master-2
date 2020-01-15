import React from "react";
import ReactDOM from "react-dom";
// import './index.css';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ProductDetails from "./product/productDetails";
import ProductList from "./product/productList";
import Search from "./product/search";
import MoreCategory from "./product/moreCategory";
import ShoppingCart from "./product/shoppingCart";
import WishList from "./product/wishList";
import Vendor from "./product/vendor";
import NotFound from "./not_found";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ContactUs from "./include/ContactUs";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Switch>
        <Route
          exact
          path="/productDetails/:id"
          component={ProductDetails}
        ></Route>
        <Route exact path="/productList/:cid" component={ProductList}></Route>
        <Route exact path="/search/:keyName" component={Search}></Route>
        <Route exact path="/moreCategory" component={MoreCategory}></Route>
        <Route exact path="/cart" component={ShoppingCart}></Route>
        <Route exact path="/wish" component={WishList}></Route>
        <Route exact path="/vendor/:id" component={Vendor}></Route>
        <Route exact path="/contactUs" component={ContactUs}></Route>
        {/* <Route  exact path="/logout" component={ShoppingCart}></Route> */}
        <Route exact path="/" component={App}></Route>
        <Route path="*" component={NotFound}></Route>
      </Switch>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
