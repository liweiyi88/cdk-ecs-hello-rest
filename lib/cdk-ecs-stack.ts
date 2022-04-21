import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs'
import { InstanceType, Peer, Vpc, Port } from 'aws-cdk-lib/aws-ec2'
import { NetworkLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as path from 'path'
import { DockerImageAsset, NetworkMode } from 'aws-cdk-lib/aws-ecr-assets'

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
      memoryLimitMiB: 512,
      portMappings: [{containerPort: 80}]
    });

    const service = new FargateService(this, 'Service', {
      cluster,
      taskDefinition
    });

    service.connections.allowFrom(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.allTraffic(), // Or whatever specific ports you want
      "Allow traffic from within the VPC to the service secure port"
    )

    const nlb = new NetworkLoadBalancer(this, 'NLB', { vpc, internetFacing: true})
    const listener = nlb.addListener('Listener', { port: 80 })
    listener.addTargets('ECSTarget', {
      port: 80,
      targets: [service]
    })
  }
}
