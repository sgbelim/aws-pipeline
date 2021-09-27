import {SynthUtils} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Billing from '../lib/billing-stack';

test('Billing Stack', () => {

    // Arrange
    const app = new cdk.App();

    // Act
    const stack = new Billing.BillingStack(app, 'MyBillingStack', {
        budgetAmount: 1,
        emailAddress: "test@example.com"
    });

    // Assert
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
