import app from './app';

const PORT = process.env['PORT'] || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Reward Jar API server running on port ${PORT}`);
});
