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



Manage-Resources
Excluir Lambda
Exemplo 1: Excluir Lambda "MinhaLambdaDeVerdade"

? Qual tipo de recurso deseja deletar? › Lambda
? Informe um padrão para filtrar (Regex ou nome exato): › MinhaLambdaDeVerdade

Excluir API Gateway
? Qual tipo de recurso deseja deletar? › APIGateway
? Informe um padrão para filtrar (Regex ou nome exato): › HelloAPI