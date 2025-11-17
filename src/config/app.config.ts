export const EnvConfiguration = () => ({
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY,
    apiUrl: process.env.PERPLEXITY_API_URL,
  },
});