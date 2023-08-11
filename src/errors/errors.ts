export class BaseException extends Error{
    status_code?: number;
    errors:  {[key: string]: string[]} = {}

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || '');
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    json(){
        return {
            "status_code": this.status_code,
            "message": this.message,
            "errors": this.errors,
            "status": "error"
        }
    }    
}


export class ValidationError extends BaseException{
    status_code = 400;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Invalid data provided.', errors);
    }
}


export class ValueError extends BaseException{
    status_code = 400;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Value error.', errors);
    }
}


export class UnknownError extends BaseException{
    status_code = 500;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Unknown error.', errors);
    }
}


export class BaseDatabaseError extends BaseException{}


export class DatabaseConnectionError extends BaseDatabaseError{
    status_code = 500;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Database connection failed.', errors);
    }
}


export class DatabaseInsertionError extends BaseDatabaseError{
    status_code = 500;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'An error occured to save the new item.', errors);
    }
    
}

export class NotFoundError extends BaseException{
    status_code = 404;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Not found.', errors);
    }
}


export class AuthenticationFailed extends BaseException{
    status_code = 401;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Unauthorized.', errors);
    }
}


export class PermissionDenied extends BaseException{
    status_code = 403;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Permission denied.', errors);
    }
}


export class ResponseProcessError extends BaseException{
    status_code = 500;

    constructor(message?: string, errors: {[key: string]: string[]} = {}) {
        super(message || 'Error occured to process response.', errors);
    }
}
