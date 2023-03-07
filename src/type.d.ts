import { persistent } from './index';
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
  transient: Function;
  persistent: Function;
  scoped: Function;
  inject: Function;
  resolve: Function;
}