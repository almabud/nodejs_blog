export abstract class Deserializable{
    deserialize(input: any): this {
        // console.log(input);
        Object.assign(this, input);
        return this;
    }
}


export abstract class BaseEntity extends Deserializable {
    createdAt: Date = new Date()
    updatedAt?: Date

    FIELDS: string [] = []

    json(excludes:(string|{}) [] = []): Record<string, any>{
        let cur_excludes: string [] = [];
        let sub_excludes: { [key: string]: string[] } = {};
        let fields = this.FIELDS.length == 0 ?  Object.keys(this) : this.FIELDS;
        let data: Record<string, any> = {};
        
        excludes.forEach((element: (string|{})) => {
            if(typeof element === 'string'){
                cur_excludes.push(element.toString())
            }else{
                sub_excludes = Object.assign(sub_excludes, element);
            }
        });
        fields.forEach((element: string) => {
            if (!cur_excludes.includes(element)){
                if(this[element as keyof this] instanceof BaseEntity){
                    let value: any = this[element as keyof this];
                    data[element] = value.json(element in sub_excludes ? sub_excludes[element] : []);
                }else{
                    data[element] = this[element as keyof this];
                }
            }
        });

        return data;
    };
}
