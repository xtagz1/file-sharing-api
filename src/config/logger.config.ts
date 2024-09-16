import { Request, Response, NextFunction } from 'express'

export async function logger(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    res.on('finish', () => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const status = res.statusCode
        const timestamp = new Date().toISOString()
        const formattedTime = timestamp.substring(0, 19)

        if (status === 304) return

        const logLevel =
            {
                5: console.error,
                4: console.warn,
                3: console.log,
                2: console.log,
            }[Math.floor(status / 100)] || console.log // Default to console.log for unknown status codes

        logLevel(
            `[${ip}][${formattedTime}] ${req.method} ${req.originalUrl} ${status}`
        )
    })

    next()
}
