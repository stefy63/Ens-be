import { Service } from 'typedi';
import { validateOrReject, ValidationError } from "class-validator";
import { Logger } from "../../decorators/Logger";
import { LoggerInterface } from "../../core/LoggerInterface";

@Service()
export class ValidatorApplier {
    constructor(@Logger(__filename) private log: LoggerInterface) {
    }

    public async apply<T>(target: T): Promise<void> {
        try {
            await validateOrReject(target);
        } catch (errors) {
            const error = new Error('ERROR_VALIDATION');
            error['errors'] = errors as ValidationError[];

            this.log.error("Errors in validation", (errors as ValidationError[]).toString());
            throw error;
        }
    }
} 
