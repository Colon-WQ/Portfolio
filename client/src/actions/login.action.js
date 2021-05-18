export const LOG_IN_USER = "LOG_IN_USER"
export const LOG_OUT_USER = "LOG_OUT_USER"

export function log_in_user(res) {
    return {
        type: LOG_IN_USER,
        payload: res
    }
}

export function log_out_user() {
    return {
        type: LOG_OUT_USER
    }
}
