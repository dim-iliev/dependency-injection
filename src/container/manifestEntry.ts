import { resolveFromManifest } from "./manifest";
import { Manifest, ManifestEntry } from "./../type.d";
import { parseDepdendecies } from "./depdendecies";

export const buildTransient = (
  instance: Function,
  name: string,
  depdendecies?: string[]
): ManifestEntry => {
  const build = () => {
    let result: ManifestEntry | null = null;
    const args = depdendecies ?? parseDepdendecies(instance);

    return {
      build,
      resolve(manifest: Manifest) {
        try {
          if (!result) {
            const params = resolveFromManifest(manifest, args);
            result = instance(...params);
          }

          return result;
        } catch (e) {
          console.error("Trying to get ", name);
          throw e;
        }
      },
    };
  };

  return build();
};

export const buildPersistent = (
  instance: Function,
  name: string,
  depdendecies?: string[]
): ManifestEntry => {
  let result: ManifestEntry | null = null;
  const args = depdendecies ?? parseDepdendecies(instance);

  const build = () => {
    return {
      build,
      resolve(manifest: Manifest) {
        try {
          if (!result) {
            const params = resolveFromManifest(manifest, args);
            result = instance(...params);
          }

          return result;
        } catch (e) {
          console.error("Trying to get ", name);
          throw e;
        }
      },
    };
  };

  return build();
};
