import * as os from 'os';
import * as path from 'path';

/**
 * Absolute directory where uploaded files are written and served from.
 * - UPLOADS_DIR when set (absolute, or relative to the working directory)
 * - On Vercel the app directory is read-only, so fall back to the tmp dir
 *   (writable but wiped between invocations — use S3/R2 for real persistence)
 * - Otherwise ./uploads, as in local dev
 */
export function uploadsRoot(): string {
  const configured = process.env.UPLOADS_DIR;
  if (configured) {
    return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
  }
  if (process.env.VERCEL) return path.join(os.tmpdir(), 'uploads');
  return path.join(process.cwd(), 'uploads');
}

/** Path stored in the DB for an uploaded file, e.g. "uploads/kyc/<userId>/<file>". */
export function storedUploadPath(absolutePath: string): string {
  return path
    .join('uploads', path.relative(uploadsRoot(), absolutePath))
    .replace(/\\/g, '/');
}
