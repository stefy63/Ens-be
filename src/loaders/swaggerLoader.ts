import * as swaggerUi from 'swagger-ui-express';
import * as basicAuth from 'express-basic-auth';
import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { env } from '../core/env';
import { getMetadataArgsStorage, MetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { Application } from "express";
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from "class-transformer/storage";


export const swaggerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.swagger.enabled) {
        const expressApp: Application = settings.getData('express_app');
        const validationMetadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
        const schemas = validationMetadatasToSchemas(validationMetadatas, {
            refPointerPrefix: '#/components/schemas/',
            classTransformerMetadataStorage: defaultMetadataStorage,
        });  

        const routingMetadataStorage: MetadataArgsStorage = getMetadataArgsStorage();
        const swaggerFile: any = routingControllersToSpec(routingMetadataStorage, {}, {
            servers: [
                {
                    url: env.app.route + env.app.routePrefix,
                },
            ],
            info: {
                title: env.app.name,
                description: env.app.description,
                version: env.app.version,
            },
            components: {
                schemas,
            },
        });

        expressApp.use(
            env.swagger.route,
            env.swagger.username ? basicAuth({
                users: {
                    [`${env.swagger.username}`]: env.swagger.password,
                },
                challenge: true,
            }) : (req, res, next) => next(),
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );

    }
};
