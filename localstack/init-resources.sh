#!/bin/bash

echo "▶️ Inicializando recursos no LocalStack..."

npx ts-node scripts/localstack/create-lambda.ts
npx ts-node scripts/localstack/create-sqs.ts
npx ts-node scripts/localstack/create-s3.ts
npx ts-node scripts/localstack/create-dynamodb.ts
npx ts-node scripts/localstack/create-api-gateway.ts

echo "✅ Todos os recursos foram provisionados no LocalStack!"
