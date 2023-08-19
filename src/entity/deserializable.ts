export abstract class Deserializable {
    deserialize(input: { [key: string]: any }): this {
        let formated_object: { [key: string]: any } = {}
        // Remove unneccessary data from the input object.
        // Object.assign() include the extra data to the new object.
        for (const field of Object.keys(this)) {
            if (field in input) {
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

    /**
     * This method is responsible to convert entity to json object.
     * @param excludes this param example
     *  - ['exclude_field_name1', 'exclude_field_name2', ...]
     *  - ['exclude_field_name1', {'exclude_field_name2': ['exclude_field_name3', ...]}]
     *  - ['exclude_field_name1', {'exclude_field_name2': ['exclude_field_name3', {'exclude_file_name4': ['exclude_field_name5', ..]}, ...]}]
     * @returns {}
     */
    json(options: { [key: string]: any } = { 'excludes': [], 'fields': [] }): Record<string, any> {
        if (!('excludes' in options)) {
            options.excludes = []
        }
        if (!('fields' in options)) {
            options.fields = []
        }

        let excludes = [...this.EXCLUDES, ...options.excludes];
        let cur_excludes: string[] = [];
        let sub_excludes: { [key: string]: string[] } = {};
        let fields = this.FIELDS.length == 0 ? Object.keys(this) : this.FIELDS;
        let sub_fields: { [key: string]: string[] } = {};
        let current_fields: string[] = [];
        let data: Record<string, any> = {};

        // Extract the nested fields.
        for ( const element of <Array<any>> options.fields){
            if (typeof element === 'string'){
                current_fields.push(element);
            }else{
                sub_fields = Object.assign(sub_fields, element)
                current_fields = [...current_fields, ...Object.keys(sub_fields)];
            }
        }
        // Now filterout the only field those are present inside entity.
        if (current_fields.length > 0) {
            let formated_fields = fields.filter(function (n) {
                return current_fields.indexOf(n) !== -1;
            });
            // If intersection of two fields element got [] then use the default fields.
            fields = formated_fields.length > 0 ? formated_fields : fields;
        }

        // Extract the ested exclueds.
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
                            sub_data.push(sub_element.json({
                                'excludes': element in sub_excludes ? sub_excludes[element] : [],
                                'fields': element in sub_fields ? sub_fields[element] : []
                            }));
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
