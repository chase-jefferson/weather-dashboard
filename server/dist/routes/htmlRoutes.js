import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const router = Router();
// TODO: Define route to serve index.html
const __dirname = path.dirname(__filename);
console.log(__dirname);
console.log(path.join(__dirname, '../dist/index.html'));
export default router;
