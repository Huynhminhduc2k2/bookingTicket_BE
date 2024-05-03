import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    ENABLE_CORS: Joi.boolean().default(false).description("Enable CORS"),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    DB_NAME: Joi.string().required().description("DB Name"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),
    ELASTIC_BASEURL: Joi.string().required().description("Elasticsearch URL"),
    ELASTIC_INDEX: Joi.string().default("booking_ticket").description("Elasticsearch Index"),
    ELASTIC_USERNAME: Joi.string().description("Elasticsearch username"),
    ELASTIC_PASSWORD: Joi.string().allow("").description("Elasticsearch password"),
    REDIS_URL: Joi.string().required().description("Redis URL"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  enableCors: envVars.ENABLE_CORS,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      dbName: envVars.DB_NAME,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  elastic: {
    baseUrl: envVars.ELASTIC_BASEURL,
    index: envVars.ELASTIC_INDEX,
    username: envVars.ELASTIC_USERNAME,
    password: envVars.ELASTIC_PASSWORD,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
};

export default config;
