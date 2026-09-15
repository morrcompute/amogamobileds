import 'web-streams-polyfill/polyfill';
import 'text-encoding-polyfill';
import structuredClone from '@ungap/structured-clone';
import * as Crypto from 'expo-crypto';

if (!('structuredClone' in globalThis)) {
  (globalThis as any).structuredClone = structuredClone;
}

if (typeof globalThis.crypto !== 'object' || globalThis.crypto === null) {
  (globalThis as any).crypto = {};
}

if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = (array: any) => Crypto.getRandomValues(array);
}

if (!globalThis.crypto.subtle) {
  (globalThis.crypto as any).subtle = {
    digest: async (_algorithm: any, data: ArrayBuffer | Uint8Array) => {
      const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
      return Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, bytes as any);
    },
  };
}
