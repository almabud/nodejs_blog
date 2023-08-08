import { User } from '../../../entity/user';
import { UserRepo } from '../../../repositories/user_repo';
import { MongoDb } from '../../db/mongo_db';
import { MongoBaseRepo } from './base_repo';
import UserModel from './models/user';


export class MongoUserRepo extends MongoBaseRepo<User> implements UserRepo{}

let db = new MongoDb('mongodb://root:root@127.0.0.1:27017/?authMechanism=DEFAULT');
db.connect();

let repo = new MongoUserRepo(UserModel, new User());
const f = async () => {
    const user = new User().deserialize({"name": "Milon", "email": "milon@test.com", "password": "1234567"});
    await user.set_password();
    const save_user = await repo.create(user);
    console.log(save_user.json());

}

f();
// repo.get_by_id('64ccbaf7d31498e1f793a37a').then((data: User) => {
//     // console.log(data);
//     // let t: any = data[0]
//     // t.id = t._id
//     console.log(data.json());
// }).catch(err => {
//     console.log(err);
// })

// let user = new User().deserialize({
//     "name": "almabud",
//     "email": "almabud37@gmail.com",
//     "password": "12345678"
// });

// user.set_password();

// // console.log(user.json());
// // console.log(user);

// let m_user = new UserModel(user);
// console.log(m_user)
// m_user.save();