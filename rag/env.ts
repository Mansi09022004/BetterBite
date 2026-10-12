// Must be the FIRST import in any script that also imports api/_lib/gemini.ts
// or api/_lib/supabaseAdmin.ts — those read process.env at module-load time,
// and ES module imports all execute before the importing file's own code
// runs, so loading .env.local has to happen in a separate module that gets
// imported ahead of them.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
