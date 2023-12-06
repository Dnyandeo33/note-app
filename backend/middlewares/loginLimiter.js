import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message:
        { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    standardHeaders: true,
    legacyHeaders: false,
})

export default loginLimiter