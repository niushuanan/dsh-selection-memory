/** Loopback call used by the selection plugin without importing the memory plugin bundle. */
const API = '/plugins/memory-system/api';
/** Distinguishes an independently disabled memory plugin from a failed model call. */
export class MemoryUnavailableError extends Error {
    name = 'MemoryUnavailableError';
}
async function read(response) {
    const raw = await response.text();
    let body;
    try {
        body = JSON.parse(raw);
    }
    catch {
        body = undefined;
    }
    if (response.status === 404)
        throw new MemoryUnavailableError('memory-system unavailable');
    if (!response.ok)
        throw new Error(typeof body?.error === 'string' ? body.error : `HTTP ${String(response.status)}`);
    if (body === undefined)
        throw new Error('invalid memory-system response');
    return body;
}
export async function rememberSelection(packet) {
    return read(await fetch(`${API}/remember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            selectedText: packet.selectedText,
            context: packet.context,
            sessionId: packet.sessionId,
            ...packet.cwd === undefined ? {} : { cwd: packet.cwd },
            sourceType: packet.sourceType,
        }),
    }));
}
export async function undoSelectionMemory(revision) {
    await read(await fetch(`${API}/documents/user/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision }),
    }));
}
//# sourceMappingURL=api.js.map