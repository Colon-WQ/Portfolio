import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';



const UserConfirmation = (message, callback) => {



    const textObj = JSON.parse(message);

    const container = document.createElement("div");
    container.setAttribute("custom-confirmation-navigation", "");
    document.body.appendChild(container);

    /**
     * If callbackState is false, user decides to not leave the page.
     * If callbackState is true, user decides to leave the page. There is a need to
     * ask the user if he wishes to save or discard work.
     *
     * @param {*} callbackState Boolean with which the callback function takes.
     * @param {*} isSave Boolean indicating whether to save current work or not.
     */
    const closeModal = async (callbackState, isSave) => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
        //if callbackState is true, then user wants to leave portfolio. Save for him.
        if (isSave) {
            console.log("saving to mongoDB")
            await axios({
                method: "PUT",
                url: process.env.REACT_APP_BACKEND + "/portfolio/upsert",
                withCredentials: true,
                data: {
                    user: textObj.user,
                    portfolio: textObj.portfolio
                }
            }).then(res => {
                console.log(res.data.message);
                callback(true);
            }).catch(err => {
                //Do not need handleErrors here since we need to deploy another logic to prevent user from navigating out of page.
                if (err.response) {
                    console.log(err.response.data);
                } else {
                    console.log(err.message);
                }
                console.log("failure to save, returning to portfolio to retry");
                callback(false)
            })
        } else {
            callback(callbackState);
        }
     };

    if (textObj.loggedIn) {
        ReactDOM.render(
            <Dialog
                open={true}
                aria-labelledby="prompt-dialog"
                aria-describedby="prompt-dialog"
                fullWidth
            >
                <DialogTitle
                    id="promp-title"
                >
                    Alert
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="prompt-text"
                    >
                        {textObj.message}
                    </DialogContentText>
                    <DialogActions>
                        <Button
                            onClick={() => closeModal(false, false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => closeModal(true, false)}
                        >
                            Discard unsaved work
                        </Button>
                        <Button
                            onClick={() => closeModal(true, true)}
                        >
                            Save work
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>,
            container
        )
    } else {
        ReactDOM.render(
            <Dialog
                open={true}
                aria-labelledby="prompt-dialog"
                aria-describedby="prompt-dialog"
                fullWidth
            >
                <DialogTitle
                    id="promp-title"
                >
                    Alert
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="prompt-text"
                    >
                        {textObj.message}
                    </DialogContentText>
                    <DialogActions>
                        <Button
                            onClick={() => closeModal(false, false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => closeModal(true, false)}
                        >
                            Leave
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>,
            container
        )
    }
    
    
}

export default UserConfirmation;
