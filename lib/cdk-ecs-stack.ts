import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { Cluster, ContainerImage, LogDriver } from 'aws-cdk-lib/aws-ecs'
import { Port, Vpc } from 'aws-cdk-lib/aws-ec2'
import * as path from 'path'
import { DockerImageAsset, NetworkMode } from 'aws-cdk-lib/aws-ecr-assets'
import { NetworkLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

export class CdkEcsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'ECSHelloRestApiVpc')

    const cluster = new Cluster(this, 'Cluster', {
      vpc,
    });

    const asset = new DockerImageAsset(this, 'ECSHelloRestApiImage', {
      directory: path.join(__dirname, '/../docker'),
      networkMode: NetworkMode.HOST,
    })

    const service = new NetworkLoadBalancedFargateService(this, 'Service', {
      publicLoadBalancer: true,
      memoryLimitMiB: 512,
      desiredCount: 2,
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromDockerImageAsset(asset),
        enableLogging: true,
        containerName: 'HelloRestApi',
        containerPort: 80,
        logDriver: LogDriver.awsLogs({streamPrefix: 'ECSHelloRestApi'})
      }
    });

    // The SG attached to service doesn't have any inbound rule, see https://github.com/aws/aws-cdk/issues/1490
    service.service.connections.allowFromAnyIpv4(Port.tcp(80))
  }
}
