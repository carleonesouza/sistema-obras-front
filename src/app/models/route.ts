export class Routes {

    recId: string;
    route?: string;
    roles: any;
    isActive: boolean;
    status: boolean;

    public constructor(init?: Partial<Routes>) {
        Object.assign(this, init);
    }
};

