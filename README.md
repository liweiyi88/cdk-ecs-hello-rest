# What is this
A cdk ECS app which spin up ECS fargate cluster behind a network load balancer with containers serves as simple hello rest api.
# Purpose
A quick way for devops to test integration between other AWS components and container cluster (e.g. cross-account networking connectivity, cdk pipeline integration with ECS etc.)
# Run
Make sure you have configured aws properly. e.g. using `aws configure` or export necessary environment variables.
Then run
1. `cdk bootstrap`
2. `cdk deploy`
