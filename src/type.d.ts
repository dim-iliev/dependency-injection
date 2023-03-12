import { persistent, getNames } from './index';
export type Manifest = Record<string, ManifestEntry>

export interface ManifestEntry {
  resolve(manifest: Manifest)
  build(): ManifestEntry
}

export interface BaseManifestOptions<T> {
  name: string
  instance: T
}

export interface TransientOptions<T> extends BaseManifestOptions<T> {

}

export interface PersistentOptions<T> extends BaseManifestOptions<T> {}

export interface Container {
  transient: <T extends Function>(
    name: string,
    instance: T,
    dependecies?: string[]
  ) => void;
  persistent: <T extends Function>(
    name: string,
    instance: T,
    dependecies?: string[]
  ) => void;
  scoped: () => Container;
  inject: <M extends (...args) => any>(method: M, dependecies?: string[]) => () => ReturnType<M>;
  resolve: (name: string) => any;
  allowOverwrite: () => void;
  disableOverwrite: () => void;
  getNames: () => string[]
}