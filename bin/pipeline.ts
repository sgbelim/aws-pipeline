#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {PipelineStackNew} from '../lib/pipeline-stack-new';
import {BillingStack} from "../lib/billing-stack";
import {ServiceStack} from "../lib/service-stack";

const app = new cdk.App();
const pipelineStackNew = new PipelineStackNew(app, 'PipelineStackNew', {});
const billingStack = new BillingStack(app, 'BillingStack', {
    budgetAmount: 5,
    emailAddress: "salimgbelim@gmail.com"
});

const serviceStackProd = new ServiceStack(app, 'ServiceStackProd')

const prodStage = pipelineStackNew.addServiceStage(serviceStackProd, "Prod")

pipelineStackNew.addBillingStackToStage(billingStack, prodStage)
