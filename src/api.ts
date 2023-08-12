import { createApp } from './app';

async function API() {
  const app = await createApp();
  await app.listen(3000, '0.0.0.0');
}

API()
  .then(() => {
    console.log('API started');
  })
  .catch(console.error);
