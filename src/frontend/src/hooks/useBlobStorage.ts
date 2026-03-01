import { HttpAgent, type HttpAgentOptions } from "@dfinity/agent";
import { useCallback, useEffect, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

// Config cache so we only load once
let configCache: {
  storageGatewayUrl: string;
  bucketName: string;
  backendCanisterId: string;
  projectId: string;
  backendHost?: string;
} | null = null;

async function ensureConfig() {
  if (configCache) return configCache;
  const config = await loadConfig();
  configCache = {
    storageGatewayUrl: config.storage_gateway_url,
    bucketName: config.bucket_name,
    backendCanisterId: config.backend_canister_id,
    projectId: config.project_id,
    backendHost: config.backend_host,
  };
  return configCache;
}

const MOTOKO_DEDUPLICATION_SENTINEL = "!caf!";

export function useBlobStorage() {
  const { identity } = useInternetIdentity();
  const [cfg, setCfg] = useState<typeof configCache>(null);

  useEffect(() => {
    ensureConfig()
      .then(setCfg)
      .catch(() => {});
  }, []);

  const uploadBlob = useCallback(
    async (file: File, onProgress?: (pct: number) => void): Promise<string> => {
      const config = await ensureConfig();
      const agentOpts: HttpAgentOptions = { host: config.backendHost };
      if (identity) agentOpts.identity = identity;
      const agent = new HttpAgent(agentOpts);
      if (config.backendHost?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const client = new StorageClient(
        config.bucketName,
        config.storageGatewayUrl,
        config.backendCanisterId,
        config.projectId,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, onProgress);
      return MOTOKO_DEDUPLICATION_SENTINEL + hash;
    },
    [identity],
  );

  const getBlobUrl = useCallback(
    (blobId: string): string => {
      if (!blobId) return "";
      const hash = blobId.startsWith(MOTOKO_DEDUPLICATION_SENTINEL)
        ? blobId.slice(MOTOKO_DEDUPLICATION_SENTINEL.length)
        : blobId;
      if (!hash || !hash.startsWith("sha256:")) return "";
      const c = cfg ?? configCache;
      if (!c) return "";
      return `${c.storageGatewayUrl}/v1/blob/?blob_hash=${encodeURIComponent(hash)}&owner_id=${encodeURIComponent(c.backendCanisterId)}&project_id=${encodeURIComponent(c.projectId)}`;
    },
    [cfg],
  );

  return { uploadBlob, getBlobUrl };
}
