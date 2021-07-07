import { combineReducers } from "redux";
import login from "./LoginReducer";
import portfolio from "./PortfolioReducer";
import error from "./ErrorReducer";


/**
 * @file Combines reducers into one using combineReducers function.
 * 
 * @module RootReducer
 * @author Chen En
 * @category Reducer
 */

export default combineReducers({
  login,
  portfolio,
  error
});