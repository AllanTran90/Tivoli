// Statiska säkerhetstester: läser källkoden och kontrollerar att hemligheter
// och serverkod aldrig kan hamna i webbläsaren.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "..");

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

const sourceFiles = listFiles(ROOT)
  .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.ts$/.test(f) && !f.includes(`${join("src", "test")}`))
  .map((path) => ({ path: relative(ROOT, path), code: readFileSync(path, "utf8") }));

const isClientFile = (code: string) => /^\s*["']use client["']/m.test(code);
const clientFiles = sourceFiles.filter((f) => isClientFile(f.code));

/** Filer som bara får köras på servern. */
const SERVER_ONLY_MODULES = ["@/lib/server/", "@/lib/centralBanken", "/app/api/"];

it("hittar källkoden (annars blir testerna nedan meningslösa)", () => {
  expect(sourceFiles.length).toBeGreaterThan(30);
  expect(clientFiles.map((f) => f.path)).toContain(join("context", "WalletContext.tsx"));
  expect(sourceFiles.map((f) => f.path)).toContain(join("lib", "server", "tivoliBank.ts"));
});

describe("säkerhet: hemligheter", () => {
  it("inga NEXT_PUBLIC_-variabler med hemliga namn", () => {
    const leaks = sourceFiles.flatMap(({ path, code }) =>
      [...code.matchAll(/NEXT_PUBLIC_[A-Z_]*(SECRET|SERVICE|PRIVATE|API_KEY|PASSWORD)[A-Z_]*/g)].map(
        (m) => `${path}: ${m[0]}`,
      ),
    );
    expect(leaks).toEqual([]);
  });

  it("klientfiler läser inga serverhemligheter från process.env", () => {
    const leaks = clientFiles.flatMap(({ path, code }) =>
      [...code.matchAll(/process\.env\.(?!NEXT_PUBLIC_)(\w+)/g)].map((m) => `${path}: ${m[1]}`),
    );
    expect(leaks).toEqual([]);
  });

  it("inga hårdkodade JWT-nycklar (t.ex. Supabase-nycklar) i koden", () => {
    const leaks = sourceFiles.filter(({ code }) => /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/.test(code));
    expect(leaks.map((f) => f.path)).toEqual([]);
  });
});

describe("säkerhet: serverkod", () => {
  it("klientfiler importerar inte serverkod", () => {
    const bad = clientFiles.flatMap(({ path, code }) =>
      SERVER_ONLY_MODULES.filter((mod) => code.includes(`from "${mod}`) || code.includes(`"${mod}`)).map(
        (mod) => `${path} → ${mod}`,
      ),
    );
    expect(bad).toEqual([]);
  });

  it("alla moduler i lib/server är markerade med server-only", () => {
    const missing = sourceFiles
      .filter(({ path }) => path.startsWith(join("lib", "server")))
      .filter(({ code }) => !code.includes('import "server-only"'))
      .map((f) => f.path);
    expect(missing).toEqual([]);
  });

  it("service role-nyckeln används bara i lib/server", () => {
    const users = sourceFiles
      .filter(({ code }) => code.includes("SUPABASE_SERVICE_ROLE_KEY"))
      .map((f) => f.path);
    expect(users.every((p) => p.startsWith(join("lib", "server")))).toBe(true);
  });
});

describe("säkerhet: klienten kan inte ändra saldot själv", () => {
  it("ingen klientkod skriver till bank- eller wallet-tabeller", () => {
    const writes = sourceFiles.flatMap(({ path, code }) =>
      [...code.matchAll(/\.from\(["'](wallet|bank_accounts|bank_transactions)["']\)/g)].map(
        (m) => `${path}: ${m[1]}`,
      ),
    );
    expect(writes).toEqual([]);
  });
});
