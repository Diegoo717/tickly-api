export const EnvConfiguration = () => ({
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY,
    apiUrl: process.env.PERPLEXITY_API_URL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY
  }
});