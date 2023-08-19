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


type ResolvedField = { 'fields': string[], 'sub_fields': { [key: string]: any }, 'sub_field_keys': string[] };


export abstract class BaseEntity extends Deserializable {
    created_at: Date = new Date()
    updated_at?: Date

    FIELDS: (string | {})[] = []
    EXCLUDES: (string | {})[] = []


    resolve_fields(fields: (string | {})[]): ResolvedField {
        let sub_fields: { [key: string]: string[] } = {};
        let current_fields: string[] = [];
        let sub_field_keys: string[] = [];
        // Extract the nested fields.
        for (const element of fields) {
            if (typeof element === 'string') {
                current_fields.push(element);
            } else {
                sub_fields = Object.assign(sub_fields, element)
                sub_field_keys.push(...Object.keys(sub_fields));
                // current_fields = [...current_fields, ...Object.keys(sub_fields)];
            }
        }

        return {
            'fields': current_fields,
            'sub_fields': sub_fields,
            'sub_field_keys': sub_field_keys
        }
    }

    get raw_fields(): ({ [key: string]: any } | string)[] {
        return this.FIELDS.length == 0 ? [...Object.keys(this)] : this.FIELDS
    }

    get fields(): string[] {
        const resolved_fields = this.resolve_fields(this.raw_fields)

        return [...resolved_fields.fields, ...resolved_fields.sub_field_keys]
    }

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

        let excludes = this.resolve_fields([...this.EXCLUDES, ...options.excludes]);
        // Extract the nested exclueds.
        let cur_excludes: string[] = excludes.fields;
        let sub_excludes: { [key: string]: string[] } = excludes.sub_fields;
        let fields = this.fields;
        let sub_fields: { [key: string]: string[] } = {};
        let current_fields: string[] = [];
        let data: Record<string, any> = {};

        // Extract the nestedfields from defautl fields.
        if (options.fields.length == 0) {
            options.fields = this.raw_fields;
        }

        // Extract the nested fields.
        const resolved_fields = this.resolve_fields(options.fields);
        current_fields = [...resolved_fields.fields, ...resolved_fields.sub_field_keys];
        sub_fields = resolved_fields.sub_fields;

        // Now filterout the only field those are present inside entity.
        if (current_fields.length > 0) {
            const formated_fields = fields.filter(function (n) {
                return current_fields.indexOf(n) !== -1;
            });
            // If intersection of two fields element got [] then use the default fields.
            fields = formated_fields.length > 0 ? formated_fields : fields;
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
                    data[element] = value.json({
                        'excludes': element in sub_excludes ? sub_excludes[element] : [],
                        'fields': element in sub_fields ? sub_fields[element] : []
                    });
                } else {
                    data[element] = this[element as keyof this];
                }
            }
        }

        return data;
    };
}
