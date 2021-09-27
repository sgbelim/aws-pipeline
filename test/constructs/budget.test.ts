import {expect as expectCDK, matchTemplate, MatchStyle, haveResource, haveResourceLike} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import {Budget} from '../../lib/constructs/budget';
import {Stack} from "@aws-cdk/core";

test('Budget construct', () => {

    // Arrange
    const app = new cdk.App();
    const stack = new Stack(app, 'dummyStack');

    // Act
    new Budget(stack, 'Budget', {
        budgetAmount: 1,
        emailAddress: "test@example.com"
    });

    // Assert
    expectCDK(stack).to(haveResourceLike('AWS::Budgets::Budget', {
        Budget: {
            BudgetLimit: {
                Amount: 1
            }
        },
        NotificationsWithSubscribers: [
            {
                Subscribers: [
                    {
                        Address: "test@example.com"
                    }
                ]
            }
        ]
    }))
});
