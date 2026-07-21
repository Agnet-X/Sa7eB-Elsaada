import serverPromise from '../server.js';

export default async function handler(req: any, res: any) {
  const app = await serverPromise;
  return app(req, res);
}
