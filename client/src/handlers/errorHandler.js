import { log_out_user } from '../actions/LoginAction';
import store from '../index';


export const handleErrors = async (err, history) => {
    
    if (err.response) {
        console.log(err.response.data);
        if (err.response.status === 401 && err.response.data === 'unauthorized user') {
            localStorage.removeItem(process.env.REACT_APP_USER_LOCALSTORAGE);
            store.dispatch(log_out_user());
            history.push('/');
        }
    } else {
        console.log(err.message);
    }
}