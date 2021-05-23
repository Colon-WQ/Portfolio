import { combineReducers } from "redux";
import login from "./login.reducer"
import portfolios from "./portfolio.reducer"


/**Root reducer combines all reducers into one using combineReducers */

/**
 * root.reducer.js combines reducers into one using combineReducers function.
 * 
 * @module reducers/root
 * @author Chen En
 * @category Reducer
 */

export default combineReducers({
  login,
  portfolios
});