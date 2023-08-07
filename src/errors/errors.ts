export class BaseException extends Error{
    error_code?: number;

    constructor(message?: string) {
        super(message || '');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}


export class ValidationError extends BaseException{
    error_code = 400;

    constructor(message?: string) {
        super(message || '');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}


export class ValueError extends BaseException{
    error_code = 400;

    constructor(message?: string) {
        super(message || '');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}


export class UnknownError extends BaseException{
    error_code = 500;

    constructor(message?: string) {
        super(message || '');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}


export class DatabaseConnectionError extends BaseException{
    error_code = 500;

    constructor(message?: string) {
        super(message || '');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends BaseException{
    error_code = 404;

    constructor(message?: string) {
        super(message || 'Not found.');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}


export class DatabaseInsertionError extends BaseException{
    error_code = 500;

    constructor(message?: string) {
        super(message || "An error occured to save the new item.");
        Object.setPrototypeOf(this, new.target.prototype);
    }
    
}
