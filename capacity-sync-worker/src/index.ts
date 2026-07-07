import { unzipSync } from "fflate";

interface Env {
  ADMIN_TOKEN: string;
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_DRIVE_FILE_ID: string;
  GOOGLE_DRIVE_CHANNEL_TOKEN: string;
  SANITY_WRITE_TOKEN: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  PUBLIC_BASE_URL?: string;
  CAPACITY_SYNC_STATE?: KVNamespace;
}

interface DriveMetadata {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  md5Checksum?: string;
  size?: string;
  version?: string;
}

interface CapacitySite {
  _key: string;
  id: string;
  stateAbbr: string;
  totalMw: number;
  computeMw: number;
  energyMw: number;
  siteCount: number;
}

interface CapacitySnapshot {
  sites: CapacitySite[];
  totalMw: number;
  computeMw: number;
  energyMw: number;
  siteCount: number;
}

interface SyncState {
  sourceModifiedTime?: string;
  sourceMd5Checksum?: string;
  lastPublishedAt?: string;
  watch?: {
    id: string;
    resourceId: string;
    expiration?: string;
  };
}

const STATE_KEY = "capacity-sync-state";
const SNAPSHOT_ID = "site-capacity-current";
const SANITY_API_VERSION = "2024-12-19";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";
const CAPACITY_SHEET_NAME = "Powered Sites";

const STATE_TO_SITE_ID: Record<string, string> = {
  CA: "california",
  CO: "colorado",
  ID: "idaho",
  KY: "kentucky",
  NJ: "newJersey",
  TX: "texas",
  UT: "utah",
};

const GEO_TO_STATE: Record<string, string> = {
  "SO. UT": "UT",
  "SLC METRO": "UT",
};

const POWERED_SITE_PROJECT_TO_STATE: Record<string, string> = {
  "WASHINGTON GATEWAY": "UT",
  "ROY AIRPORT OFFICES": "UT",
  "MURRAY MIXED MF": "UT",
  "VERNAL MAIN ST #1": "UT",
  "CANYON VIEW APARTMENTS": "UT",
  "WALL AVENUE": "UT",
  "LEHI LOFTS": "UT",
  "ALPINE STORAGE": "ID",
  "EDGE LOFTS": "NJ",
  "BOUNTIFUL - ORCHARD": "UT",
  "SYRACUSE": "UT",
};

const jsonHeaders = {
  "Content-Type": "application/json",
};

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: { ...jsonHeaders, ...(init.headers || {}) },
  });
}

function unauthorized() {
  return json({ error: "Unauthorized" }, { status: 401 });
}

function requireAdmin(request: Request, env: Env): Response | null {
  const header = request.headers.get("Authorization") || "";
  return header === `Bearer ${env.ADMIN_TOKEN}` ? null : unauthorized();
}

function required(env: Env, key: keyof Env): string {
  const value = env[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${String(key)} is required`);
  }
  return value;
}

function base64Url(input: string | ArrayBuffer): string {
  const bytes =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const normalized = pem.replace(/\\n/g, "\n");
  const base64 = normalized
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function googleAccessToken(env: Env): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: required(env, "GOOGLE_CLIENT_EMAIL"),
    scope: DRIVE_SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    exp: iat + 3600,
    iat,
  };

  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(required(env, "GOOGLE_PRIVATE_KEY")),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const assertion = `${unsigned}.${base64Url(signature)}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const body = (await response.json()) as { access_token?: string; error?: string };
  if (!response.ok || !body.access_token) {
    throw new Error(`Google token request failed: ${response.status} ${body.error || ""}`);
  }
  return body.access_token;
}

async function driveFetch(env: Env, path: string, init: RequestInit = {}) {
  const token = await googleAccessToken(env);
  return fetch(`https://www.googleapis.com/drive/v3/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
}

async function fetchDriveMetadata(env: Env): Promise<DriveMetadata> {
  const fields = "id,name,mimeType,modifiedTime,md5Checksum,size,version";
  const response = await driveFetch(
    env,
    `files/${encodeURIComponent(required(env, "GOOGLE_DRIVE_FILE_ID"))}?fields=${encodeURIComponent(fields)}&supportsAllDrives=true`,
  );
  if (!response.ok) {
    throw new Error(`Drive metadata fetch failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function downloadDriveFile(env: Env): Promise<ArrayBuffer> {
  const metadata = await fetchDriveMetadata(env);
  const fileId = encodeURIComponent(required(env, "GOOGLE_DRIVE_FILE_ID"));
  const path =
    metadata.mimeType === "application/vnd.google-apps.spreadsheet"
      ? `files/${fileId}/export?mimeType=${encodeURIComponent(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )}`
      : `files/${fileId}?alt=media&supportsAllDrives=true`;
  const response = await driveFetch(env, path);
  if (!response.ok) {
    throw new Error(`Drive file download failed: ${response.status} ${await response.text()}`);
  }
  return response.arrayBuffer();
}

function decodeXml(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function attr(xml: string, name: string): string | null {
  const pattern = new RegExp(`\\s${name}="([^"]*)"`);
  const match = xml.match(pattern);
  return match ? decodeXml(match[1]) : null;
}

function colIndex(cellRef: string): number {
  const letters = (cellRef.match(/[A-Z]+/i)?.[0] || "A").toUpperCase();
  let n = 0;
  for (const letter of letters) n = n * 26 + letter.charCodeAt(0) - 64;
  return n - 1;
}

function textFile(files: Record<string, Uint8Array>, path: string): string {
  const file = files[path];
  if (!file) throw new Error(`Missing workbook part: ${path}`);
  return new TextDecoder().decode(file);
}

function sharedStrings(files: Record<string, Uint8Array>): string[] {
  if (!files["xl/sharedStrings.xml"]) return [];
  const xml = textFile(files, "xl/sharedStrings.xml");
  return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((si) =>
    [...si[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map((t) => decodeXml(t[1]))
      .join(""),
  );
}

function workbookSheetPath(files: Record<string, Uint8Array>, sheetName: string): string {
  const workbook = textFile(files, "xl/workbook.xml");
  const rels = textFile(files, "xl/_rels/workbook.xml.rels");
  const relTargets = new Map<string, string>();
  for (const match of rels.matchAll(/<Relationship\b([^>]*)\/>/g)) {
    const id = attr(match[1], "Id");
    const target = attr(match[1], "Target");
    if (id && target) relTargets.set(id, target);
  }
  for (const match of workbook.matchAll(/<sheet\b([^>]*)\/>/g)) {
    if (attr(match[1], "name") !== sheetName) continue;
    const rid = attr(match[1], "r:id");
    const target = rid ? relTargets.get(rid) : null;
    if (!target) break;
    return target.startsWith("/") ? target.slice(1) : `xl/${target}`;
  }
  throw new Error(`Sheet not found: ${sheetName}`);
}

function parseRows(sheetXml: string, strings: string[]): string[][] {
  return [...sheetXml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map((row) => {
    const values: string[] = [];
    for (const cell of row[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const cellAttrs = cell[1];
      const body = cell[2];
      const ref = attr(cellAttrs, "r") || "A1";
      const type = attr(cellAttrs, "t");
      const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      const inline = body.match(/<t\b[^>]*>([\s\S]*?)<\/t>/)?.[1];
      let value = "";
      if (type === "s" && v !== undefined) value = strings[Number(v)] || "";
      else if (inline !== undefined) value = decodeXml(inline);
      else if (v !== undefined) value = decodeXml(v);
      values[colIndex(ref)] = value;
    }
    return values.map((value) => value || "");
  });
}

function numberValue(raw: string, field: string): number {
  const parsed = Number(String(raw || "").replace(/,/g, "").trim());
  if (!Number.isFinite(parsed)) throw new Error(`Invalid number for ${field}: ${raw}`);
  return parsed;
}

function headerIndex(header: string[], label: string): number {
  const index = header.findIndex((value) => value.trim().toLowerCase() === label.toLowerCase());
  if (index === -1) throw new Error(`Missing required column: ${label}`);
  return index;
}

function normalizeState(raw: string): string {
  const trimmed = raw.trim().toUpperCase();
  const mapped = GEO_TO_STATE[trimmed] || trimmed;
  if (!STATE_TO_SITE_ID[mapped]) throw new Error(`Unsupported Geo/Market value: ${raw}`);
  return mapped;
}

function inferProjectState(project: string): string | null {
  const normalizedProject = project.trim().toUpperCase();
  const exact = POWERED_SITE_PROJECT_TO_STATE[normalizedProject];
  if (exact) return exact;

  for (const stateMatch of normalizedProject.matchAll(/(?:^|[,\s(])([A-Z]{2})(?=$|[,\s)#])/g)) {
    if (STATE_TO_SITE_ID[stateMatch[1]]) return stateMatch[1];
  }

  return null;
}

function resolveState(project: string, rawGeo: string): string {
  if (rawGeo.trim()) return normalizeState(rawGeo);

  const inferredState = inferProjectState(project);
  if (inferredState) return inferredState;

  throw new Error(`Missing Geo/Market for Powered Sites project: ${project}`);
}

function roundMapMw(value: number): number {
  return Math.round(value);
}

function parseCapacityWorkbook(buffer: ArrayBuffer): CapacitySnapshot {
  const files = unzipSync(new Uint8Array(buffer));
  const strings = sharedStrings(files);
  const sheetPath = workbookSheetPath(files, CAPACITY_SHEET_NAME);
  const rows = parseRows(textFile(files, sheetPath), strings).filter((row) =>
    row.some((value) => value.trim() !== ""),
  );
  const headerRowIndex = rows.findIndex((row) => row.some((value) => value.trim() === "Total Capacity (MW)"));
  if (headerRowIndex === -1) throw new Error(`Could not find ${CAPACITY_SHEET_NAME} header row`);

  const header = rows[headerRowIndex].map((value) => value.trim());
  const projectIndex = headerIndex(header, "Project");
  const totalMwIndex = headerIndex(header, "Total Capacity (MW)");
  const assetTypeIndex = headerIndex(header, "Asset Type");
  const geoIndex = headerIndex(header, "Geo/Market");

  const byState = new Map<string, { totalMw: number; computeMw: number; energyMw: number; siteCount: number }>();

  let totalMw = 0;
  let computeMw = 0;
  let energyMw = 0;
  let siteCount = 0;

  for (const row of rows.slice(headerRowIndex + 1)) {
    const project = (row[projectIndex] || "").trim();
    const rawCapacity = (row[totalMwIndex] || "").trim();
    const rawGeo = (row[geoIndex] || "").trim();
    if (!project && !rawCapacity && !rawGeo) continue;
    if (!project || !rawCapacity) continue;

    const stateAbbr = resolveState(project, rawGeo);
    const capacity = numberValue(rawCapacity, `${project} total MW`);
    const assetType = (row[assetTypeIndex] || "").trim().toLowerCase();
    const projectKey = project.toLowerCase();
    const isEnergy = assetType.includes("energy") || projectKey.includes("bess") || projectKey.includes("pv +");
    const current = byState.get(stateAbbr) || { totalMw: 0, computeMw: 0, energyMw: 0, siteCount: 0 };

    current.totalMw += capacity;
    if (isEnergy) current.energyMw += capacity;
    else current.computeMw += capacity;
    current.siteCount += 1;
    byState.set(stateAbbr, current);

    totalMw += capacity;
    if (isEnergy) energyMw += capacity;
    else computeMw += capacity;
    siteCount += 1;
  }

  const sites: CapacitySite[] = [...byState.entries()].map(([stateAbbr, values]) => {
    const id = STATE_TO_SITE_ID[stateAbbr];
    return {
      _key: id,
      id,
      stateAbbr,
      totalMw: roundMapMw(values.totalMw),
      computeMw: values.computeMw,
      energyMw: values.energyMw,
      siteCount: values.siteCount,
    };
  });

  if (!sites.length) throw new Error("No state capacity rows found");
  return {
    sites: sites.sort((a, b) => b.totalMw - a.totalMw),
    totalMw: roundMapMw(totalMw),
    computeMw,
    energyMw,
    siteCount,
  };
}

async function readState(env: Env): Promise<SyncState> {
  if (!env.CAPACITY_SYNC_STATE) return {};
  return ((await env.CAPACITY_SYNC_STATE.get(STATE_KEY, "json")) as SyncState | null) || {};
}

async function writeState(env: Env, state: SyncState) {
  if (!env.CAPACITY_SYNC_STATE) return;
  await env.CAPACITY_SYNC_STATE.put(STATE_KEY, JSON.stringify(state));
}

async function publishToSanity(env: Env, metadata: DriveMetadata, snapshot: CapacitySnapshot) {
  const projectId = env.SANITY_PROJECT_ID || "05vcm5dh";
  const dataset = env.SANITY_DATASET || "production";
  const publishedAt = new Date().toISOString();
  const document = {
    _id: SNAPSHOT_ID,
    _type: "siteCapacitySnapshot",
    id: "current",
    title: "Current site capacity snapshot",
    sourceProvider: "google-drive-xlsx",
    sourceFileId: metadata.id,
    sourceFileName: metadata.name,
    sourceModifiedTime: metadata.modifiedTime,
    sourceMd5Checksum: metadata.md5Checksum,
    publishedAt,
    totalMw: snapshot.totalMw,
    computeMw: snapshot.computeMw,
    energyMw: snapshot.energyMw,
    siteCount: snapshot.siteCount,
    sites: snapshot.sites,
  };
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${required(env, "SANITY_WRITE_TOKEN")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations: [{ createOrReplace: document }] }),
    },
  );
  if (!response.ok) {
    throw new Error(`Sanity publish failed: ${response.status} ${await response.text()}`);
  }
  return { publishedAt, sanity: await response.json() };
}

async function syncCapacity(env: Env, force = false) {
  const metadata = await fetchDriveMetadata(env);
  const state = await readState(env);
  const unchanged =
    !force &&
    metadata.modifiedTime &&
    metadata.modifiedTime === state.sourceModifiedTime &&
    (!metadata.md5Checksum || metadata.md5Checksum === state.sourceMd5Checksum);
  if (unchanged) {
    return { status: "skipped", reason: "source unchanged", sourceModifiedTime: metadata.modifiedTime };
  }

  const workbook = await downloadDriveFile(env);
  const snapshot = parseCapacityWorkbook(workbook);
  const publish = await publishToSanity(env, metadata, snapshot);
  await writeState(env, {
    ...state,
    sourceModifiedTime: metadata.modifiedTime,
    sourceMd5Checksum: metadata.md5Checksum,
    lastPublishedAt: publish.publishedAt,
  });
  return {
    status: "ok",
    sourceModifiedTime: metadata.modifiedTime,
    sourceMd5Checksum: metadata.md5Checksum,
    publishedAt: publish.publishedAt,
    totalMw: snapshot.totalMw,
    siteCount: snapshot.siteCount,
    states: snapshot.sites.length,
  };
}

function webhookAddress(request: Request, env: Env) {
  const base = env.PUBLIC_BASE_URL || new URL(request.url).origin;
  return new URL("/drive/notifications", base).toString();
}

async function registerDriveWatch(request: Request, env: Env) {
  const state = await readState(env);
  const token = await googleAccessToken(env);
  if (state.watch?.id && state.watch.resourceId) {
    await fetch("https://www.googleapis.com/drive/v3/channels/stop", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id: state.watch.id, resourceId: state.watch.resourceId }),
    }).catch(() => undefined);
  }

  const id = crypto.randomUUID();
  const expiration = Date.now() + 23 * 60 * 60 * 1000;
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(required(env, "GOOGLE_DRIVE_FILE_ID"))}/watch?supportsAllDrives=true`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        type: "web_hook",
        address: webhookAddress(request, env),
        token: required(env, "GOOGLE_DRIVE_CHANNEL_TOKEN"),
        expiration,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Drive watch registration failed: ${response.status} ${await response.text()}`);
  }
  const watch = (await response.json()) as { id: string; resourceId: string; expiration?: string };
  await writeState(env, { ...state, watch });
  return watch;
}

async function handleDriveNotification(request: Request, env: Env) {
  const token = request.headers.get("X-Goog-Channel-Token");
  if (token !== required(env, "GOOGLE_DRIVE_CHANNEL_TOKEN")) {
    throw new Error("Invalid Drive channel token");
  }
  const resourceState = request.headers.get("X-Goog-Resource-State");
  if (resourceState === "sync") return;
  await syncCapacity(env, false);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (request.method === "POST" && url.pathname === "/drive/notifications") {
        ctx.waitUntil(handleDriveNotification(request, env));
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && url.pathname === "/admin/sync") {
        const auth = requireAdmin(request, env);
        if (auth) return auth;
        return json(await syncCapacity(env, url.searchParams.get("force") === "1"));
      }
      if (request.method === "POST" && url.pathname === "/admin/watch") {
        const auth = requireAdmin(request, env);
        if (auth) return auth;
        return json(await registerDriveWatch(request, env));
      }
      if (request.method === "GET" && url.pathname === "/health") {
        return json({ status: "ok" });
      }
      return json({ error: "Not found" }, { status: 404 });
    } catch (error) {
      console.error(error);
      return json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const request = new Request(env.PUBLIC_BASE_URL || "https://helios-capacity-sync-worker.workers.dev");
    ctx.waitUntil(registerDriveWatch(request, env));
  },
};

export { parseCapacityWorkbook };
