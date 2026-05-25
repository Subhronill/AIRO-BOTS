import { PrismaClient } from '@prisma/client';

// SQLite stores these as strings — auto-parse them on every read
const JSON_FIELD_NAMES = new Set(['options', 'answers', 'condition', 'metadata']);

function deserializeResult(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(deserializeResult);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const record = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      if (JSON_FIELD_NAMES.has(key) && typeof value === 'string') {
        try { result[key] = JSON.parse(value); } catch { result[key] = value; }
      } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        result[key] = deserializeResult(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return obj;
}

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(prisma as any).$use(async (params: any, next: any) => {
  const result = await next(params);
  return deserializeResult(result);
});

export default prisma;
