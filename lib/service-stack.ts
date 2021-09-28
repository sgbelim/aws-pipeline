import * as cdk from '@aws-cdk/core';
import {CfnParametersCode, Code, Function, Runtime} from "@aws-cdk/aws-lambda";
import {HttpApi} from "@aws-cdk/aws-apigatewayv2";
import {LambdaProxyIntegration} from "@aws-cdk/aws-apigatewayv2-integrations";
import {CfnParameter} from "@aws-cdk/core";

export class ServiceStack extends cdk.Stack {

    public readonly serviceCode: CfnParametersCode;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.serviceCode = Code.fromCfnParameters({
            bucketNameParam: new CfnParameter(this, 'ServiceLambdaBucket'),
            objectKeyParam: new CfnParameter(this, 'ServiceLambdaBucketObject'),
        });

        const lambda = new Function(this, 'ServiceLambda', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'src/lambda.handler',
            code: this.serviceCode,
            functionName: 'ServiceLambda'
        })

        new HttpApi(this, 'ApiGatewayService', {
            defaultIntegration: new LambdaProxyIntegration({
                handler: lambda
            }),
            apiName: 'MyService'
        })

    }
}
