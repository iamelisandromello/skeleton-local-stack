Dependências AWS 
npm install \
  @aws-sdk/client-lambda \
  @aws-sdk/client-s3 \
  @aws-sdk/client-sqs \
  @aws-sdk/client-dynamodb \
  @aws-sdk/client-api-gateway \
  @aws-sdk/client-cloudwatch-logs \
  @aws-sdk/client-kinesis \
  @aws-sdk/client-sns


Verificar recursos AWS no LocalStack

#verificar lambdas criadas#
aws --endpoint-url=http://localhost:4566 lambda list-functions

