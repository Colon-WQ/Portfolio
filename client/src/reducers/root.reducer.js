import { combineReducers } from "redux";
import login from "./login.reducer"
import portfolios from "./portfolio.reducer"


/**Root reducer combines all reducers into one using combineReducers */
export default combineReducers({
  login,
  portfolios
});