export const LOG_IN_USER = "LOG_IN_USER"
export const LOG_OUT_USER = "LOG_OUT_USER"

export function log_in_user(user) {
    return {
        type: LOG_IN_USER,
        payload: user
    }
}

export function log_out_user() {
    return {
        type: LOG_OUT_USER
    }
}
