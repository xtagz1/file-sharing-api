import cors from 'cors'

export default class CorsConfig {
    private static appUrl = process.env.APP_URL as string


    private static corsOptions = {
        origin: [
            'https://whipo-903tdf5j8-whipozs-projects.vercel.app',
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
