export abstract class Deserializable {
    deserialize(input: { [key: string]: any }): this {
        let formated_object: { [key: string]: any } = {}
        // Remove unneccessary data from the input object.
        // Object.assign() include the extra data to the new object.
        for (const field of Object.keys(this)) {
            if(field !== field.toUpperCase() && field in input){
                formated_object[field] = input[field];
            }
        }
        // console.log(input);
        Object.assign(this, formated_object);
        return this;
    }
}


export abstract class BaseEntity extends Deserializable {
    created_at: Date = new Date()
    updated_at?: Date

    FIELDS: string[] = []
    EXCLUDES: (string | {})[] = []

    json(excludes: (string | {})[] = []): Record<string, any> {
        excludes = [...this.EXCLUDES, ...excludes];
        let cur_excludes: string[] = [];
        let sub_excludes: { [key: string]: string[] } = {};
        let fields = this.FIELDS.length == 0 ? Object.keys(this) : this.FIELDS;
        let data: Record<string, any> = {};

        for (const element of excludes) {
            if (typeof element === 'string') {
                cur_excludes.push(element.toString())
            } else {
                sub_excludes = Object.assign(sub_excludes, element);
            }
        }

        for (const element of fields) {
            if (!cur_excludes.includes(element)) {
                if (this[element as keyof this] instanceof Array) {
                    const list_elements: any[] = <Array<any>>this[element as keyof this]
                    let sub_data: any[] = []
                    for (const sub_element of list_elements) {
                        if (sub_element instanceof BaseEntity) {
                            sub_data.push(sub_element.json(element in sub_excludes ? sub_excludes[element] : []))
                        } else {
                            sub_data.push(sub_element);
                        }
                    }
                    data[element] = sub_data;
                } else if (this[element as keyof this] instanceof BaseEntity) {
                    let value: any = this[element as keyof this];
                    data[element] = value.json(element in sub_excludes ? sub_excludes[element] : []);
                } else {
                    data[element] = this[element as keyof this];
                }
            }
        }

        return data;
    };
}
