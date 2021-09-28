#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {PipelineStackV1} from '../lib/pipeline-stack-v1';
import {BillingStack} from "../lib/billing-stack";
import {ServiceStack} from "../lib/service-stack";

const app = new cdk.App();
const pipelineStack = new PipelineStackV1(app, 'PipelineStackV1', {});
new BillingStack(app, 'BillingStack', {
    budgetAmount: 5,
    emailAddress: "salimgbelim@gmail.com"
});

const serviceStackProd = new ServiceStack(app, 'ServiceStackProd')
pipelineStack.addServiceState(serviceStackProd, "Prod")
