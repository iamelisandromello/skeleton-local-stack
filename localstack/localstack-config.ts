function parseBool(env?: string, fallback = false): boolean {
  return env?.toLowerCase() === 'true' ? true : fallback
}

export const servicesToCheck = {
  s3: parseBool(process.env.CHECK_S3, true),
  sqs: parseBool(process.env.CHECK_SQS, true),
  lambda: parseBool(process.env.CHECK_LAMBDA, true),
  apigateway: parseBool(process.env.CHECK_APIGATEWAY, true),
  dynamodb: parseBool(process.env.CHECK_DYNAMODB, true),
  cloudwatch: parseBool(process.env.CHECK_CLOUDWATCH, false),
  sns: parseBool(process.env.CHECK_SNS, false),
  kinesis: parseBool(process.env.CHECK_KINESIS, false)
}
