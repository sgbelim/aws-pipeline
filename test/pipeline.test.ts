import {arrayWith, expect as expectCDK, haveResourceLike, objectLike, SynthUtils} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Pipeline from '../lib/pipeline-stack-new';
import {ServiceStack} from "../lib/service-stack";
import {PipelineStackNew} from "../lib/pipeline-stack-new";

test('Pipeline Stack', () => {

    // Arrange
    const app = new cdk.App();

    // Act
    const stack = new Pipeline.PipelineStackNew(app, 'MyTestStack');

    // Assert
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("Adding service state", () => {
    // Arrange
    const app = new cdk.App();
    const serviceStack = new ServiceStack(app, 'ServiceStack')
    const pipelineStack = new PipelineStackNew(app, 'PipelineStack')

    // Act
    pipelineStack.addServiceStage(serviceStack, "Test")

    // Assert
    expectCDK(pipelineStack).to(haveResourceLike("AWS::CodePipeline::Pipeline", {
        Stages: arrayWith(objectLike({
            Name: "Test"
        }))
    }))
});

