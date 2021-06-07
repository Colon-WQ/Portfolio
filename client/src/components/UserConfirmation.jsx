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

    const closeModal = async (callbackState, isSave) => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
        //if callbackState is true, then user wants to leave portfolio. Save for him.
        if (isSave) {
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

    ReactDOM.render(
        <Dialog
            open={true}
            aria-labelledby="prompt-dialog"
            aria-describedby="prompt-dialog"
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
                        Discard work
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
    
}

export default UserConfirmation;
