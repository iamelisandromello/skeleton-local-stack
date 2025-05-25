// @types/archiver/index.d.ts

declare module 'archiver' {
  import type { EventEmitter } from 'node:events'
  import type * as stream from 'node:stream'

  export interface ArchiverOptions {
    zlib?: { level?: number }
  }

  export interface Archiver extends EventEmitter {
    directory(dirpath: string, destpath?: string): this
    pipe(destination: stream.Writable): this
    finalize(): Promise<void>
    on(event: 'error', listener: (err: Error) => void): this
    pointer(): number
  }

  function archiver(format: 'zip', options?: ArchiverOptions): Archiver

  export default archiver
}
