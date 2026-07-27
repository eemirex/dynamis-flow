import { mkdir, rename } from "node:fs/promises";

// The public portfolio deployment is a credential-free static demo. Server-only
// routes stay in the repository and in normal builds, but are moved outside the
// App Router during Netlify's static export build.
const serverOnlyRoot = ".netlify-server-only";
const serverOnlyPaths = [
  ["src/proxy.ts", `${serverOnlyRoot}/proxy.ts`],
  ["src/app/api", `${serverOnlyRoot}/api`],
  ["src/app/auth/callback", `${serverOnlyRoot}/auth-callback`],
];

await mkdir(serverOnlyRoot, { recursive: true });

for (const [source, destination] of serverOnlyPaths) {
  try {
    await rename(source, destination);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
