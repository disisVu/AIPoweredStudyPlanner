export default () => ({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '5000',
  baseUrl:
    `http://${process.env.HOST}:${process.env.PORT}` ||
    'https://localhost:5000',
});
