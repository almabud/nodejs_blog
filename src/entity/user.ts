import { UnknownError, ValidationError, ValueError } from "../errors/errors";
import { BaseEntity } from "./deserializable";
import bcrypt from 'bcrypt';


export class User extends BaseEntity{
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    authenticated: boolean = true;

    private SALT_ROUND = 10;
    FIELDS: string[] = ['id', 'name', 'email', 'created_at', 'updated_at']

    async set_password(): Promise<void> {
        if (this.password == undefined || this.password == null){
            throw new ValueError("password not set yet.");
        }
        try {
            this.password = await bcrypt.hash(this.password, this.SALT_ROUND);
          } catch (error) {
            throw new UnknownError('Error hashing password');
          }
    }

    async check_password(password: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(password, this.password!);
            return isMatch;
          } catch (error) {
            throw new ValidationError('email or password does not match.');
          }
    }
}


export class AnonymousUser extends User{
  authenticated: boolean = false;

  json(excludes?: (string | {})[]): Record<string, any> {
    return {}
  }
}
 