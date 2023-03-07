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