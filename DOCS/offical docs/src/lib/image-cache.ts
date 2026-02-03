import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";
import { existsSync } from "fs";

console.log("[Image Cache] Initializing image fetch cache...");

const CACHE_DIR = join(process.cwd(), ".next", "cache", "images");

const memoryCache = new Map<string, ArrayBuffer>();

function getCacheKey(url: string): string {
  return createHash("md5").update(url).digest("hex");
}

const types: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

function getContentType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase();
  return types[ext || ""] || "image/png";
}

const originalFetch = global.fetch;
const fetchPromises = new Map<string, Promise<Response>>();

export async function enableImageFetchCache(): Promise<void> {
  console.log("[Image Cache] Enabling image fetch cache...");

  await mkdir(CACHE_DIR, { recursive: true }).catch(() => {});

  if (global.fetch !== cachedFetch) {
    global.fetch = cachedFetch as typeof fetch;
  }
}

export function disableImageFetchCache(): void {
  global.fetch = originalFetch;
  fetchPromises.clear();
}

async function cachedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  if (
    !(!init || !init.method || init.method === "GET") ||
    !url.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i)
  )
    return originalFetch(input, init);

  const cacheKey = getCacheKey(url);

  if (memoryCache.has(cacheKey)) {
    const cachedData = memoryCache.get(cacheKey)!;
    console.log(`[Image Cache] Memory cache hit for ${url}`);

    return new Response(cachedData, {
      status: 200,
      headers: { "Content-Type": getContentType(url) },
    });
  }

  const diskCachePath = join(CACHE_DIR, `${cacheKey}.png`);
  console.log("Disk cache path: " + diskCachePath);

  if (existsSync(diskCachePath)) {
    let fileData, fileMeta;

    if (!existsSync(`${diskCachePath}.meta.json`)) {
      console.warn(`[Image Cache] Missing metadata for cached image ${url}.`);
      fileData = await readFile(diskCachePath);
    } else {
      const fileDataPromise = readFile(diskCachePath);
      const fileMetaPromise = readFile(`${diskCachePath}.meta.json`, "utf-8");

      const promiseReturns = await Promise.all([
        fileDataPromise,
        fileMetaPromise,
      ]);
      fileData = promiseReturns[0];
      const fileMetaJSON = promiseReturns[1];

      fileMeta = JSON.parse(fileMetaJSON);
    }

    console.log(`[Image Cache] Disk cache hit for ${url}`);

    memoryCache.set(cacheKey, fileData.buffer);

    return new Response(fileData.buffer, {
      status: fileMeta.status || 200,
      statusText: fileMeta.statusText,
      headers: fileMeta.headers || { "Content-Type": getContentType(url) },
    });
  }

  if (fetchPromises.has(url)) {
    console.log(`[Image Cache] Fetch already in progress for ${url}`);
    return (await fetchPromises.get(url)!).clone();
  }

  console.log(`[Image Cache] Fetching ${url}`);

  const promise = originalFetch(input, init).then(async (response) => {
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();

      memoryCache.set(cacheKey, arrayBuffer);

      console.log(`[Image Cache] Cached image ${url} to memory`);

      void saveImageToDisk({
        arrayBuffer,
        url,
        cacheKey,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }).catch((err) => {
        console.error(
          `[Image Cache] Failed to save image to disk cache: ${err}`,
        );
      });

      return new Response(arrayBuffer, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
    return response;
  });

  fetchPromises.set(url, promise);

  promise.finally(() => {
    fetchPromises.delete(url);
  });

  const response = await promise;
  return response.clone();
}

async function saveImageToDisk({
  arrayBuffer,
  url,
  cacheKey,
  status,
  statusText,
  headers,
}: {
  arrayBuffer: ArrayBuffer;
  url: string;
  cacheKey: string;
  status: number;
  statusText: string;
  headers: Headers;
}): Promise<void> {
  console.log(`[Image Cache] Saving image to disk cache: ${cacheKey}`);
  const ext = url.split(".").pop() || "png";
  const filePath = join(CACHE_DIR, `${cacheKey}.${ext}`);

  const imageWritePromise = writeFile(filePath, Buffer.from(arrayBuffer));
  const metaWritePromise = writeFile(
    `${filePath}.meta.json`,
    JSON.stringify(
      {
        url,
        status,
        statusText,
        headers: Object.fromEntries(headers.entries()),
        timestamp: Date.now(),
      },
      null,
      2,
    ),
  );

  await Promise.all([imageWritePromise, metaWritePromise]);
  console.log(`[Image Cache] Image saved to disk cache: ${filePath}`);
}
