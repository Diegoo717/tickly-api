export const EnvConfiguration = () => ({
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY,
    apiUrl: process.env.PERPLEXITY_API_URL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost', 
    port: parseInt(process.env.DATABASE_PORT!, 10) || 5436,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME || 'tickly_db',
  },
});
