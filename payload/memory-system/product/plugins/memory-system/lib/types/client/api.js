/** Browser transport for the fixed global memory documents and selection action. */
const API = '/plugins/memory-system/api';
export class MemoryRequestError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
async function jsonResponse(response) {
    const body = await response.json();
    if (!response.ok) {
        throw new MemoryRequestError(response.status, typeof body.error === 'string' ? body.error : `HTTP ${String(response.status)}`);
    }
    return body;
}
export async function loadMemoryDocuments(signal) {
    return jsonResponse(await fetch(`${API}/documents`, signal === undefined ? undefined : { signal }));
}
export async function saveMemoryDocument(kind, content, revision) {
    return jsonResponse(await fetch(`${API}/documents/${kind}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, revision }),
    }));
}
export async function restoreMemoryDocument(kind, revision) {
    return jsonResponse(await fetch(`${API}/documents/${kind}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision }),
    }));
}
export async function rememberSelection(source) {
    return jsonResponse(await fetch(`${API}/remember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(source),
    }));
}
/** Ask the Host for one immediate AI-memory pass that includes brand-new messages.
 *
 * @returns The pass outcome as the Host scheduler reports it.
 */
export async function organizeAiMemory() {
    return jsonResponse(await fetch(`${API}/maintain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
    }));
}
//# sourceMappingURL=api.js.map