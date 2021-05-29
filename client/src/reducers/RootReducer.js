import { combineReducers } from "redux";
import login from "./LoginReducer"
import portfolios from "./PortfolioReducer"


/**
 * @file Combines reducers into one using combineReducers function.
 * 
 * @module RootReducer
 * @author Chen En
 * @category Reducer
 */

export default combineReducers({
  login,
  portfolios
});