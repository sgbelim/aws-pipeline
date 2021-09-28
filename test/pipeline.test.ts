import {arrayWith, expect as expectCDK, haveResourceLike, objectLike, SynthUtils} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Pipeline from '../lib/pipeline-stack-new';
import {ServiceStack} from "../lib/service-stack";
import {PipelineStackNew} from "../lib/pipeline-stack-new";
import {BillingStack} from "../lib/billing-stack";

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
    const serviceStack = new ServiceStack(app, 'ServiceStack', {
        stageName: "Test"
    })
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

test("Adding billing stack to a stage", () => {
    // Arrange
    const app = new cdk.App();
    const serviceStack = new ServiceStack(app, 'ServiceStack', {
        stageName: "Test"
    })
    const pipelineStackNew = new PipelineStackNew(app, 'PipelineStack')
    const billingStack = new BillingStack(app, 'BillingStack', {
        budgetAmount: 5,
        emailAddress: "test@test.com"
    })
    const testStage = pipelineStackNew.addServiceStage(serviceStack, "Test");

    // Act
    pipelineStackNew.addBillingStackToStage(billingStack, testStage)

    // Assert
    expectCDK(pipelineStackNew).to(
        haveResourceLike("AWS::CodePipeline::Pipeline", {
            Stages: arrayWith(objectLike({
                Actions: arrayWith(objectLike({
                    Name: "Billing_Update"
                }))
            }))
        }))
});
