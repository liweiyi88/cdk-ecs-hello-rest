# What is this
A cdk app which spin up an ECS fargate cluster behind a network load balancer with containers serves as simple hello rest api.
# Purpose
A quick way for devops to test integration between ECS and other AWS resources or test network connectivity between ECS and other AWS resources.
# Run
Make sure you have configured aws properly. e.g. using `aws configure` or export necessary environment variables.
Then run
1. `cdk bootstrap`
2. `cdk deploy`
