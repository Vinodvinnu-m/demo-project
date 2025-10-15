import dotenv from 'dotenv'
dotenv.config()
const mongoDbConnectionString = process.env.MONGO_CONNECTION_STRING
const serverPort = process.env.PORT
const jwtSecretKey = process.env.JWT_TOKEN_SECRET_KEY
const url = process.env.BASE_URL
const tokenExpiryTime = process.env.TOKEN_EXPIRY_TIME

export let AppConfigData = {

    serverDetails:{
        port:serverPort,
        baseUrl : url
    },
    db:{
        connectionString:mongoDbConnectionString
    },
    JWT:{
        secretKey: jwtSecretKey,
        tokenExpiry: tokenExpiryTime
    }
}