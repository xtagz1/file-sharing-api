import cors from 'cors'

export default class CorsConfig {
    private static appUrl = process.env.APP_URL as string


    private static corsOptions = {
        origin: [
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            CorsConfig.appUrl,
        ],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
    }

    public static initializeCors(): any {
        return cors(CorsConfig.corsOptions)
    }
}
