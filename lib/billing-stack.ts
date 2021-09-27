import * as cdk from '@aws-cdk/core';
import {Budget} from "./constructs/budget";
import {StackProps} from "@aws-cdk/core";

interface BillilngStackProps extends StackProps {
    budgetAmount: number,
    emailAddress: string
}

export class BillingStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: BillilngStackProps) {
        super(scope, id, props);

        new Budget(this, 'Budget', {
            budgetAmount: props.budgetAmount,
            emailAddress: props.emailAddress
        })
    }
}
