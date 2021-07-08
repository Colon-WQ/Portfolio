//standard success handling. Note: still need to return this function
export const handleSuccess = (response, data, log) => {
    if (log !== undefined) {
        console.log(log);
    }
    return response.status(200).json(data);
}