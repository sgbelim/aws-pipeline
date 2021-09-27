import {SynthUtils} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Pipeline from '../lib/pipeline-stack-v1';

test('Pipeline Stack', () => {

    // Arrange
    const app = new cdk.App();

    // Act
    const stack = new Pipeline.PipelineStackV1(app, 'MyTestStack');

    // Assert
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
