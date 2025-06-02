export const successResponse = (res, data,message='SUCCESS', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

export const errorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message,
    });
}