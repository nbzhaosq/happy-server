import * as fs from 'fs/promises';
import * as path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

export function getUploadDir() {
    return UPLOAD_DIR;
}

export async function putObject(key: string, data: any) {
    const fullPath = path.join(UPLOAD_DIR, key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, data);
}

export async function getObject(key: string) {
    const fullPath = path.join(UPLOAD_DIR, key);
    return fs.readFile(fullPath);
}

export async function deleteObject(key: string) {
    const fullPath = path.join(UPLOAD_DIR, key);
    await fs.unlink(fullPath);
}

export function getPublicUrl(path: string) {
    return `/uploads/${path}`;
}

export type ImageRef = {
    width: number;
    height: number;
    thumbhash: string;
    path: string;
}
