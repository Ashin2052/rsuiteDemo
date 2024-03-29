import { faker } from '@faker-js/faker/locale/en';
export function mockUsers(length:any) {
    const createRowData = (rowIndex: number) => {
        const firstName = faker.name.firstName();
        const lastName = ''
        const gender = faker.name.gender(true);
        // @ts-ignore
        const name = faker.name.findName(firstName, lastName, gender);
        const avatar = faker.image.avatar();

        const city = faker.address.city();
        const street = faker.address.street();
        const email = faker.internet.email();
        const postcode = faker.address.zipCode();
        const phone = faker.phone.number();
        const amount = faker.finance.amount(1000, 90000);

        const age = Math.floor(Math.random() * 30) + 18;
        const stars = Math.floor(Math.random() * 10000);
        const followers = Math.floor(Math.random() * 10000);
        const rating = 2 + Math.floor(Math.random() * 3);
        const progress = Math.floor(Math.random() * 100);

        return {
            id: rowIndex + 1,
            name,
            firstName,
            lastName,
            avatar,
            city,
            street,
            postcode,
            email,
            phone,
            gender,
            age,
            stars,
            followers,
            rating,
            progress,
            amount
        };
    };

    return Array.from({ length }).map((_, index) => {
        return createRowData(index);
    });
}

export function mockTreeData(options: { limits: any; labels: any; getRowData: any; }){
    const { limits, labels, getRowData } = options;
    const depth = limits.length;

    const data: any[] = [];
    const mock = (list: any[], parentValue: string | undefined, layer = 0) => {
        const length = limits[layer];
        Array.from({ length }).forEach((_, index) => {
            const value = parentValue ? parentValue + '-' + (index + 1) : index + 1 + '';
            const children: any[] = [];
            const label = Array.isArray(labels) ? labels[layer] : labels;
            let row = {
                label: typeof label === 'function' ? label(layer, value, faker) : label + ' ' + value,
                value
            };

            if (getRowData) {
                row = {
                    ...row,
                    ...getRowData(layer, value)
                };
            }

            list.push(row);

            if (layer < depth - 1) {
                // @ts-ignore
                row['children'] = children;
                mock(children, value, layer + 1);
            }
        });
    };

    // @ts-ignore
    mock(data);

    return data;
}