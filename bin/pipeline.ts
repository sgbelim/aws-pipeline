#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {PipelineStackV2} from '../lib/pipeline-stack-v2';
import {BillingStack} from "../lib/billing-stack";
import {ServiceStack} from "../lib/service-stack";

const app = new cdk.App();
const pipelineStack = new PipelineStackV2(app, 'PipelineStackV2', {});
new BillingStack(app, 'BillingStack', {
    budgetAmount: 5,
    emailAddress: "salimgbelim@gmail.com"
});

const serviceStackProd = new ServiceStack(app, 'ServiceStackProd')
pipelineStack.addServiceState(serviceStackProd, "Prod")
