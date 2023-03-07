import { buildTransient, buildPersistent } from './manifestEntry';
import { Manifest } from "./../type.d";
import { parseDepdendecies } from "./depdendecies";
import makeManifest, {
  copyManifest,
  resolveFromManifest,
} from "./manifest";

const build = (from?: Manifest) => {
  const manifest = from ? copyManifest(from) : makeManifest();

  return {
    transient: <T extends Function>(
      name: string,
      instance: T,
      dependecies?: string[]
    ) => {
      manifest[name] = buildTransient(instance, dependecies)
    },
    persistent: <T extends Function>(
      name: string,
      instance: T,
      dependecies?: string[]
    ) => {
      manifest[name] = buildPersistent(instance, dependecies)
    },
    scoped: () => {
      return build(manifest);
    },
    resolve: (name: string) => {
      return resolveFromManifest(manifest, [name])[0]?.resolve() || null;
    },
    inject: (method: Function, dependecies?: string[]) => {
      const params = resolveFromManifest(
        manifest,
        dependecies || parseDepdendecies(method)
      );
      return method(...params);
    },
  };
};

export default build;
