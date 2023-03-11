import { buildTransient, buildPersistent } from './manifestEntry';
import { Manifest } from "./../type.d";
import { parseDepdendecies } from "./depdendecies";
import makeManifest, {
  copyManifest,
  resolveFromManifest,
} from "./manifest";

const build = (from?: Manifest, buildOptions: {allowOverwrite?: boolean} = {}) => {
  const manifest = from ? copyManifest(from) : makeManifest();
  let options = {
    allowOverwrite: true,
    ...buildOptions
  }

  return {
    allowOverwrite() {
      options.allowOverwrite = true
    },
    disableOverwrite() {
      options.allowOverwrite = false;
    },
    transient: <T extends Function>(
      name: string,
      instance: T,
      dependecies?: string[]
    ) => {
      if(options.allowOverwrite || !manifest[name]) {
        manifest[name] = buildTransient(instance, name, dependecies)
      }
    },
    persistent: <T extends Function>(
      name: string,
      instance: T,
      dependecies?: string[]
    ) => {
      if(options.allowOverwrite || !manifest[name]) {
        manifest[name] = buildPersistent(instance, name, dependecies)
      }
    },
    scoped: () => {
      return build(manifest, options);
    },
    resolve: (name: string) => {
      return resolveFromManifest(manifest, [name])[0];
    },
    inject: (method: Function, dependecies?: string[]) => {
      const params = resolveFromManifest(
        manifest,
        dependecies || parseDepdendecies(method)
      );

      return () => method(...params);
    },
  };
};

export default build;
