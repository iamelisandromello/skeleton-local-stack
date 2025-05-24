import inquirer from 'inquirer'
import {
  deleteTablesByFilter,
  deleteQueuesByFilter,
  deleteBucketsByFilter,
  deleteRestApisByFilter,
  deleteLambdaFunctionsByFilter,
  deleteApiGatewayRoutesByFilter
} from './resource-deleters'

async function main() {
  const { resourceType, pattern } = await inquirer.prompt([
    {
      type: 'list',
      name: 'resourceType',
      message: 'Qual recurso deseja excluir?',
      choices: [
        'lambda',
        'sqs',
        's3',
        'dynamodb',
        'apigateway',
        'apigateway-route'
      ]
    },
    {
      type: 'input',
      name: 'pattern',
      message: 'Informe o padrão (regex ou nome exato):',
      default: '.*'
    }
  ])

  const regex = new RegExp(pattern)

  switch (resourceType) {
    case 'lambda':
      await deleteLambdaFunctionsByFilter(regex)
      break
    case 'sqs':
      await deleteQueuesByFilter(regex)
      break
    case 's3':
      await deleteBucketsByFilter(regex)
      break
    case 'dynamodb':
      await deleteTablesByFilter(regex)
      break
    case 'apigateway':
      await deleteRestApisByFilter(regex)
      break
    case 'apigateway-route': {
      const { apiId } = await inquirer.prompt([
        {
          type: 'input',
          name: 'apiId',
          message: 'Informe o ID da API Gateway onde estão as rotas a excluir:'
        }
      ])
      await deleteApiGatewayRoutesByFilter(apiId, regex)
      break
    }
  }

  console.log('\n✅ Recursos excluídos com sucesso.')
}

main().catch((err) => {
  console.error('❌ Erro ao excluir recursos:', err)
  process.exit(1)
})
