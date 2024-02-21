# ECS (Blue/Green) Deployment using CodePipeline

## How to setup everything

-   Go to ECS and create a cluster. For infrastructure choose fargate
-   Create a task definition. Create a service based on this task definition
-   Select the cluster. Create a service. Specify the number of tasks
-   In the deployment options, select Blue/Green deployment (powered by CodeDeploy)
-   Blue/Green deployment requires an application load balancer, two target groups
-   When the service is created, a CodeDeploy application is also created behind the scene
-   This CodeDeploy application can be used for future usage or we can seperately create a CodeDeploy application
-   If we create an application, and a deployment group ourselves, we need to specify the cluster, service, load balancer and the target groups
-   The service needs to be updated in order to associate the created target group with the service

## Deployment Flow

-   Source code is pushed to a CodeCommit repository
-   This push triggers the CodePipeline Source stage
-   At the end of the Source stage, code is stored in SourceArtifact in zipped format
-   In Build stage in CodeBuild, a docker image is created from the source and then pushed to ECR
-   Using AWS cli, the task definition is fetched and stored into a file
-   The image property is changed to the newly pushed Image URI
-   A new task definition revision is created from the file
-   Newly created task defintion revision arn is fetched using AWS CLI
-   appspec.yml is updated with the new task definition arn and it is produced as the artifact of the Build stage
-   The Deploy stage begins now... when setting up the Deploy stage, we specify the CodeDeploy app and deployment group
-   At the start of Deploy stage, the deployment group receives the appspec.yml file and updates the service based on specified task definiion arn
-   CodeDeploy creates a replacement task set, and registers the targets in the second target group
-   Finally, CodeDeploy points the load balancer to this second target group and kills the original task set

### Before

![Initial State of Service](https://github.com/letsgoforitanik/aws-ecs-codedeploy-blue-green/blob/master/before.png)

### After

![Service State after Deployment](https://github.com/letsgoforitanik/aws-ecs-codedeploy-blue-green/blob/master/after.png)
