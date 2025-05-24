import * as fs from 'node:fs'
import * as path from 'node:path'
import archiver from 'archiver' // já reconhecido com tipos customizados

async function packageLambda() {
  const outputPath = path.resolve(__dirname, '../lambda.zip')
  const distPath = path.resolve(__dirname, '../dist')
  const nodeModulesPath = path.resolve(__dirname, '../node_modules')

  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  return new Promise<void>((resolve, reject) => {
    output.on('close', () => {
      console.log(
        `Arquivo zip criado em: ${outputPath} (${archive.pointer()} bytes)`
      )
      resolve()
    })

    archive.on('error', (err: Error) => reject(err))

    archive.pipe(output)

    archive.directory(distPath, '')

    archive.directory(nodeModulesPath, 'node_modules')

    archive.finalize()
  })
}

packageLambda().catch((err) => {
  console.error('Erro ao criar zip da Lambda:', err)
  process.exit(1)
})
