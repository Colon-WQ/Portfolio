

export const handleErrors = (response, status, err, message) => {

    if (err !== undefined) {
        console.log(err);
    }
    
    if (message === undefined) {
        return response.status(status).send("error encountered");
    } else {
        return response.status(status).send(message);
    }
}