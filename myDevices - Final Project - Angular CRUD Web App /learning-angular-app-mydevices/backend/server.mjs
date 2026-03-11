import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbFilePath = join(__dirname, 'data', 'db.json');
const port = Number(process.env.PORT ?? 3001);

const defaultDb = {
  users: [
    {
      id: 1,
      email: 'admin@mydevices.app',
      passwordHash: hashPassword('Admin123!'),
      role: 'admin',
    },
  ],
  savedItems: [],
};

function hashPassword(rawPassword) {
  return createHash('sha256').update(`mydevices-${rawPassword}`).digest('hex');
}

async function readDb() {
  try {
    const file = await readFile(dbFilePath, 'utf8');
    return JSON.parse(file);
  } catch {
    await writeDb(defaultDb);
    return structuredClone(defaultDb);
  }
}

async function writeDb(data) {
  await writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { message: 'Missing URL' });
    return;
  }

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/register') {
    try {
      const { email, password } = await readBody(req);
      if (!email || !password) {
        sendJson(res, 400, { message: 'Email and password are required.' });
        return;
      }

      const db = await readDb();
      const normalizedEmail = String(email).trim().toLowerCase();
      const exists = db.users.some((user) => user.email === normalizedEmail);
      if (exists) {
        sendJson(res, 409, { message: 'Account already exists.' });
        return;
      }

      const nextId = db.users.length === 0 ? 1 : Math.max(...db.users.map((user) => user.id)) + 1;
      db.users.push({
        id: nextId,
        email: normalizedEmail,
        passwordHash: hashPassword(String(password)),
        role: 'user',
      });
      await writeDb(db);

      sendJson(res, 201, { message: 'Registered.', userId: nextId });
      return;
    } catch {
      sendJson(res, 400, { message: 'Invalid request body.' });
      return;
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    try {
      const { email, password } = await readBody(req);
      const db = await readDb();
      const normalizedEmail = String(email ?? '').trim().toLowerCase();
      const user = db.users.find((entry) => entry.email === normalizedEmail);

      if (!user || user.passwordHash !== hashPassword(String(password ?? ''))) {
        sendJson(res, 401, { message: 'Invalid credentials.' });
        return;
      }

      sendJson(res, 200, {
        token: createToken(user),
        user: { id: user.id, email: user.email, role: user.role },
      });
      return;
    } catch {
      sendJson(res, 400, { message: 'Invalid request body.' });
      return;
    }
  }

  const savedItemsMatch = url.pathname.match(/^\/api\/users\/(\d+)\/saved-items$/);
  if (savedItemsMatch && req.method === 'GET') {
    const userId = Number(savedItemsMatch[1]);
    const db = await readDb();
    const items = db.savedItems.filter((item) => item.userId === userId);
    sendJson(res, 200, { items });
    return;
  }

  if (savedItemsMatch && req.method === 'POST') {
    const userId = Number(savedItemsMatch[1]);
    try {
      const { objectId, name } = await readBody(req);
      if (!objectId || !name) {
        sendJson(res, 400, { message: 'objectId and name are required.' });
        return;
      }

      const db = await readDb();
      const exists = db.savedItems.some((item) => item.userId === userId && item.objectId === objectId);
      if (exists) {
        sendJson(res, 409, { message: 'Item already saved.' });
        return;
      }

      db.savedItems.push({
        userId,
        objectId,
        name,
        savedAt: new Date().toISOString(),
      });
      await writeDb(db);

      sendJson(res, 201, { message: 'Item saved.' });
      return;
    } catch {
      sendJson(res, 400, { message: 'Invalid request body.' });
      return;
    }
  }

  const deleteSavedItemMatch = url.pathname.match(/^\/api\/users\/(\d+)\/saved-items\/([^/]+)$/);
  if (deleteSavedItemMatch && req.method === 'DELETE') {
    const userId = Number(deleteSavedItemMatch[1]);
    const objectId = decodeURIComponent(deleteSavedItemMatch[2]);

    const db = await readDb();
    db.savedItems = db.savedItems.filter((item) => !(item.userId === userId && item.objectId === objectId));
    await writeDb(db);

    sendJson(res, 200, { message: 'Item removed.' });
    return;
  }

  sendJson(res, 404, { message: 'Route not found.' });
});

server.listen(port, () => {
  console.log(`[myDevices backend] listening on http://localhost:${port}`);
});
