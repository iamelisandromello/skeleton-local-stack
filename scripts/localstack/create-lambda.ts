import { lambda, LAMBDA_NAME } from './aws-config'

import fs from 'node:fs'
import path from 'node:path'
import { CreateFunctionCommand } from '@aws-sdk/client-lambda'

const functionName = LAMBDA_NAME
const zipFilePath = path.resolve(__dirname, '../../lambda.zip')

async function createLambda() {
  const zipBuffer = fs.readFileSync(zipFilePath)

  try {
    const command = new CreateFunctionCommand({
      FunctionName: functionName,
      Runtime: 'nodejs18.x',
      Role: 'arn:aws:iam::000000000000:role/lambda-role',
      Handler: 'main/index.handler',
      Code: { ZipFile: zipBuffer },
      Publish: true
    })

    await lambda.send(command)
    console.log(`✅ Lambda criada: ${functionName}`)
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name: string }).name === 'ResourceConflictException'
    ) {
      console.log(`ℹ️ Lambda '${functionName}' já existe.`)
    } else {
      console.error('❌ Erro ao criar Lambda:', err)
    }
  }
}

createLambda()
