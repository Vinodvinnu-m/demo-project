import dotenv from 'dotenv'
dotenv.config()
const mongoDbConnectionString = process.env.MONGO_CONNECTION_STRING
const serverPort = process.env.PORT
const jwtSecretKey = process.env.JWT_TOKEN_SECRET_KEY

export let AppConfigData = {

    serverDetails:{
        port:serverPort
    },
    db:{
        connectionString:mongoDbConnectionString
    },
    JWT:{
        secretKey: jwtSecretKey
    }
}