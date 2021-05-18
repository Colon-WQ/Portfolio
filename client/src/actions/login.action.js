export const LOG_IN_USER = "LOG_IN_USER"
export const LOG_OUT_USER = "LOG_OUT_USER"

export const log_in_user = res => ({
    type: LOG_IN_USER,
    payload: { ...res }
})

export const log_out_user = () => ({
    type: LOG_OUT_USER
})
