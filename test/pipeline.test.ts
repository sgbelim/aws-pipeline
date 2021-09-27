import {SynthUtils} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Pipeline from '../lib/pipeline-stack';

test('Empty Stack', () => {

    // Arrange
    const app = new cdk.App();

    // Act
    const stack = new Pipeline.PipelineStack(app, 'MyTestStack');

    // Assert
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
