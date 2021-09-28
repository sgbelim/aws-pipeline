import * as cdk from '@aws-cdk/core';
import {Artifact, Pipeline} from "@aws-cdk/aws-codepipeline";
import {
    CloudFormationCreateUpdateStackAction,
    CodeBuildAction,
    GitHubSourceAction
} from "@aws-cdk/aws-codepipeline-actions";
import {SecretValue} from "@aws-cdk/core";
import {BuildSpec, LinuxBuildImage, PipelineProject} from "@aws-cdk/aws-codebuild";
import {ServiceStack} from "./service-stack";

export class PipelineStackV1 extends cdk.Stack {

    public readonly pipeline: Pipeline;
    public readonly cdkBuildOutput: Artifact;
    public readonly serviceBuildOutput: Artifact;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.pipeline = new Pipeline(this, 'Pipeline', {
            pipelineName: 'Pipeline',
            crossAccountKeys: false,
            restartExecutionOnUpdate: true
        })

        const cdkSourceOutput = new Artifact('CdkSourceOutput')
        const serviceSourceOutput = new Artifact('ServiceSourceOutput')

        this.pipeline.addStage({
            stageName: 'Source',
            actions: [
                new GitHubSourceAction({
                    owner: 'sgbelim',
                    repo: 'aws-pipeline',
                    branch: 'main',
                    actionName: 'Pipeline_Source',
                    oauthToken: SecretValue.secretsManager('github-token'),
                    output: cdkSourceOutput
                }),
                new GitHubSourceAction({
                    owner: 'sgbelim',
                    repo: 'express-lambda',
                    branch: 'main',
                    actionName: 'Service_Source',
                    oauthToken: SecretValue.secretsManager('github-token'),
                    output: serviceSourceOutput
                })
            ]
        })

        this.cdkBuildOutput = new Artifact('CdkBuildOutput')
        this.serviceBuildOutput = new Artifact('ServiceBuildOutput')

        this.pipeline.addStage({
            stageName: 'Build',
            actions: [
                new CodeBuildAction({
                    actionName: 'CDK_Build',
                    input: cdkSourceOutput,
                    outputs: [this.cdkBuildOutput],
                    project: new PipelineProject(this, 'CdkBuildProject', {
                        environment: {
                            buildImage: LinuxBuildImage.STANDARD_5_0
                        },
                        buildSpec: BuildSpec.fromSourceFilename('build-specs/cdk-build-spec.yml')
                    })
                }),
                new CodeBuildAction({
                    actionName: 'Service_Build',
                    input: serviceSourceOutput,
                    outputs: [this.serviceBuildOutput],
                    project: new PipelineProject(this, 'ServiceBuildProject', {
                        environment: {
                            buildImage: LinuxBuildImage.STANDARD_5_0
                        },
                        buildSpec: BuildSpec.fromSourceFilename('build-specs/service-build-spec.yml')
                    })
                })
            ]
        })

        this.pipeline.addStage({
            stageName: 'Pipeline_Update',
            actions: [
                new CloudFormationCreateUpdateStackAction({
                    actionName: "Pipeline_Update",
                    stackName: "PipelineStack",
                    templatePath: this.cdkBuildOutput.atPath('PipelineStack.template.json'),
                    adminPermissions: true
                })
            ]
        })
    }

    public addServiceState(serviceStack: ServiceStack, stageName: string) {

        this.pipeline.addStage({
            stageName: stageName,
            actions: [
                new CloudFormationCreateUpdateStackAction({
                    actionName: "Service_Update",
                    stackName: serviceStack.stackName,
                    templatePath: this.cdkBuildOutput.atPath(`${serviceStack.stackName}.template.json`),
                    adminPermissions: true,
                    parameterOverrides: {
                        ...serviceStack.serviceCode.assign(
                            this.serviceBuildOutput.s3Location
                        ),
                    },
                    extraInputs: [this.serviceBuildOutput],
                })
            ]
        })

    }
}
