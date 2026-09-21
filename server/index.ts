import { app } from './app';

const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[HRMS Backend] Server listening on http://0.0.0.0:${PORT}`);
});
