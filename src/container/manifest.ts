import { Manifest, TransientOptions } from "../type";
import { buildPersistent, buildTransient } from "./manifestEntry";

export default function makeManifest(): Manifest {
  return {};
}

export const copyManifest = (manifest: Manifest) => {
  return Object.entries(manifest).reduce((acc, [name, entry]) => {
    return {
      ...acc,
      [name]: entry.build(),
    };
  }, makeManifest());
};

export const resolveFromManifest = (
  manifest: Manifest,
  depedendecies: string[]
) => {
  return depedendecies.map((dep) => manifest[dep]?.resolve(manifest) || null);
};