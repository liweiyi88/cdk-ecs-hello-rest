import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { Cluster, ContainerImage, FargateTaskDefinition, LogDriver } from 'aws-cdk-lib/aws-ecs'
import { InstanceType, Port, Vpc } from 'aws-cdk-lib/aws-ec2'
import * as path from 'path'
import { DockerImageAsset, NetworkMode } from 'aws-cdk-lib/aws-ecr-assets'
import { NetworkLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

export class CdkEcsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'ECSVpc')

    const cluster = new Cluster(this, 'Cluster', {
      vpc,
    });

    cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: new InstanceType("t2.medium"),
      desiredCapacity: 2,
    });

    const taskDefinition = new FargateTaskDefinition(this, 'TaskDef');

    const asset = new DockerImageAsset(this, 'HelloRestApi', {
      directory: path.join(__dirname, '/../docker'),
      networkMode: NetworkMode.HOST,
    })

    taskDefinition.addContainer('RestApi', {
      image: ContainerImage.fromDockerImageAsset(asset),
      memoryLimitMiB: 256,
      portMappings: [{containerPort: 80}],
      logging: LogDriver.awsLogs({streamPrefix: 'HelloRestApi'})
    });

    const service = new NetworkLoadBalancedFargateService(this, 'Service', {
      publicLoadBalancer: true,
      cluster,
      taskDefinition
    });

    // The SG attached to service doesn't have any inbound rule, see https://github.com/aws/aws-cdk/issues/1490
    service.service.connections.allowFromAnyIpv4(Port.tcp(80))
  }
}
