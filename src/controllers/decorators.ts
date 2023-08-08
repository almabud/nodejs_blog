import { Config } from "../config/config";
import { BaseRequest } from "../entity/request";
import { BaseResponse, ErrorResponse } from "../entity/response";
import { BaseException, PermissionDenied, ResponseProcessError, UnknownError, ValueError } from "../errors/errors";
import { BasePermissionProcessor } from "./permission_processors/base_permission_processor";


async function ResponseProcessor(request: BaseRequest, response: BaseResponse) {
    const config: Config = request.config;
    const response_processors = config.RESPONSE_PROCESSORS;
    let res:any  = response;

    for (const res_pro of response_processors) {
        res = await res_pro.process(request, res);
    }

    return res;
}


export function EnsureInitialization(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        this._ready.then((ready: boolean) => {
            console.log("hello")
            return originalMethod.apply(...args);
        })
    }
}


export function PermissionProcessor(permissions: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            return this._ready.then(async (data: boolean) => {
                let result: {} = {};
                const request: BaseRequest = this.request;
                const response: BaseResponse | undefined = this.response;
                const config: Config = request.config;

                try {
                    if (response) {
                        return await ResponseProcessor(request, response);
                    }

                    for (const permission of permissions) {
                        const perInstance: BasePermissionProcessor = config.PERMISSION_PROCESSORS[permission];
                        if (!await perInstance.has_permission(request)) {
                            throw new PermissionDenied();
                        }
                    }
                    // Get the result and process the response.
                    result = await ResponseProcessor(request, originalMethod.apply(this, args));
                } catch (error) {
                    if (error instanceof ResponseProcessError) {
                        throw error;
                    } else if (error instanceof UnknownError) {
                        throw error;
                    } else if (error instanceof BaseException) {
                        result = await ResponseProcessor(request, new ErrorResponse().deserialize(error.json()));
                    } else if (error instanceof Error) {
                        throw new UnknownError(error.message);
                    } else {
                        throw new UnknownError('An error occured to handle this request.');
                    }
                }

                return result;
            })
        };
    }
}


export function RequestProcessor<T extends { new(...args: any[]): {} }>(constructor: T) {
    // Apply default decorator to ensure the request processed.
    // let descriptors = Object.getOwnPropertyDescriptors(constructor.prototype);
    // for (const [propName, descriptor] of Object.entries(descriptors)) {
    //     if (typeof descriptor.value == 'function' && propName != 'constructor') {
    //         const originalMethod = descriptor.value;
    //         EnsureInitialization(constructor, propName, descriptor);
    //         if (originalMethod != descriptor.value) {
    //             copyMetadata(originalMethod, descriptor.value);
    //         }
    //     }
    //     Object.defineProperty(constructor.prototype, propName, descriptor);
    // }

    return class extends constructor {
        request?: BaseRequest
        private _response?: BaseResponse
        _ready: Promise<boolean>

        constructor(...args: any[]) {
            let [request, ...rest] = args;
            super(...rest);
            this._ready = this.run_request_processor(request);
        }

        private async run_request_processor(request: Object & BaseRequest) {
            try {
                const config = new Config();
                if (Object.keys(request).length == 0) {
                    throw new UnknownError('request not provided.');
                }
                request.config = config;
                // Process the request.
                for (const processor of config.REQUEST_PROCESSORS) {
                    request = await processor.process(request);
                }
                // Request processing is complete now intialize the contorller.
                // Add the request to the controller.
                this.request = request;
            } catch (error) {
                if (error instanceof UnknownError) {
                    throw error;
                } else if (error instanceof BaseException) {
                    // Bind the errors with the controller. So, that it can be handled when controller method
                    // is called.
                    this._response = new ErrorResponse().deserialize(error.json());
                } else if (error instanceof Error) {
                    throw new UnknownError(error.message);
                } else {
                    throw new UnknownError('An error occured to handle this request.');
                }
            }

            return true;
        }

        get response(): BaseResponse | undefined {
            return this._response;
        }
    };
}
