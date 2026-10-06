/** Fixed-path atomic persistence for the two global memory documents. */
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const MISSING_REVISION = 'missing';
const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024;
export class MemoryStoreError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
function revisionOf(content) {
    return createHash('sha256').update(content, 'utf8').digest('hex');
}
function filenameFor(kind) {
    return kind === 'user' ? 'user.md' : 'ai.md';
}
async function existsFile(path) {
    return stat(path).then(info => info.isFile(), (error) => {
        if (error.code === 'ENOENT')
            return false;
        throw error;
    });
}
function validCursor(value) {
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}
function validFailure(value) {
    if (typeof value !== 'object' || value === null)
        return undefined;
    const failure = value;
    if (typeof failure.at !== 'string' || typeof failure.message !== 'string')
        return undefined;
    return { at: failure.at, message: failure.message };
}
/** Owns only `${DSH_HOME}/memory/*`; callers never supply a path. */
export class MemoryDocumentStore {
    root;
    history;
    statePath;
    constructor(dshHome) {
        this.root = join(dshHome, 'memory');
        this.history = join(this.root, 'history');
        this.statePath = join(this.root, 'state.json');
    }
    async read(kind) {
        const path = join(this.root, filenameFor(kind));
        const info = await stat(path).catch((error) => {
            if (error.code === 'ENOENT')
                return undefined;
            throw error;
        });
        const canRestore = (await this.historyFiles(kind)).length > 0;
        if (info === undefined) {
            return { kind, path, exists: false, content: '', revision: MISSING_REVISION, canRestore };
        }
        if (!info.isFile() || info.size > MAX_DOCUMENT_BYTES) {
            throw new MemoryStoreError(info.size > MAX_DOCUMENT_BYTES ? 413 : 400, `${filenameFor(kind)} is not an editable memory document`);
        }
        const content = await readFile(path, 'utf8');
        return {
            kind,
            path,
            exists: true,
            content,
            revision: revisionOf(content),
            updatedAt: info.mtime.toISOString(),
            canRestore,
        };
    }
    async write(kind, content, expectedRevision, reason) {
        if (Buffer.byteLength(content, 'utf8') > MAX_DOCUMENT_BYTES) {
            throw new MemoryStoreError(413, 'memory document is too large');
        }
        const current = await this.read(kind);
        if (current.revision !== expectedRevision) {
            throw new MemoryStoreError(409, 'memory document changed; load the latest version before saving');
        }
        await mkdir(this.root, { recursive: true });
        if (current.exists)
            await this.saveHistory(kind, current.content, current.revision, reason);
        await this.atomicWrite(join(this.root, filenameFor(kind)), content);
        return this.read(kind);
    }
    async restorePrevious(kind, expectedRevision) {
        const current = await this.read(kind);
        if (current.revision !== expectedRevision) {
            throw new MemoryStoreError(409, 'memory document changed; load the latest version before restoring');
        }
        const files = await this.historyFiles(kind);
        const latest = files.at(-1);
        if (latest === undefined)
            throw new MemoryStoreError(404, 'no previous memory revision is available');
        const content = await readFile(join(this.history, latest), 'utf8');
        if (current.exists)
            await this.saveHistory(kind, current.content, current.revision, 'restore');
        await this.atomicWrite(join(this.root, filenameFor(kind)), content);
        return this.read(kind);
    }
    async readState() {
        try {
            const value = JSON.parse(await readFile(this.statePath, 'utf8'));
            if (typeof value !== 'object' || value === null)
                return { lastMaintenanceCursor: 0 };
            const state = value;
            // `lastDailyCursor` is the pre-rename field carrying identical millisecond-cursor semantics.
            const cursor = state.lastMaintenanceCursor ?? state.lastDailyCursor;
            const failure = validFailure(state.lastMaintenanceError);
            return {
                lastMaintenanceCursor: validCursor(cursor),
                ...typeof state.lastMaintenanceAt === 'string' ? { lastMaintenanceAt: state.lastMaintenanceAt } : {},
                ...failure === undefined ? {} : { lastMaintenanceError: failure },
                ...typeof state.lastProvider === 'string' ? { lastProvider: state.lastProvider } : {},
                ...typeof state.lastModel === 'string' ? { lastModel: state.lastModel } : {},
            };
        }
        catch (error) {
            if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                return { lastMaintenanceCursor: 0 };
            }
            throw error;
        }
    }
    async writeState(state) {
        await mkdir(this.root, { recursive: true });
        await this.atomicWrite(this.statePath, `${JSON.stringify(state, null, 2)}\n`);
    }
    async saveHistory(kind, content, revision, reason) {
        await mkdir(this.history, { recursive: true });
        const stamp = new Date().toISOString().replace(/[:.]/gu, '-');
        const filename = `${kind}-${stamp}-${reason}-${revision.slice(0, 12)}-${randomUUID()}.md`;
        await this.atomicWrite(join(this.history, filename), content);
    }
    async historyFiles(kind) {
        if (!await existsFile(this.history) && !await stat(this.history).then(info => info.isDirectory(), () => false))
            return [];
        return (await readdir(this.history))
            .filter(name => name.startsWith(`${kind}-`) && name.endsWith('.md'))
            .sort();
    }
    async atomicWrite(path, content) {
        const temporary = `${path}.dsh-${randomUUID()}.tmp`;
        try {
            await writeFile(temporary, content, { encoding: 'utf8', flag: 'wx', mode: 0o644 });
            await rename(temporary, path);
        }
        finally {
            await unlink(temporary).catch(() => undefined);
        }
    }
}
//# sourceMappingURL=store.js.map