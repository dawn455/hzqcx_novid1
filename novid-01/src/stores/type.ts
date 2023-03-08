declare module namespace {

    export interface StatisGradeCityDetail {
        grade: string;
        sdate: string;
        syear: number;
        wzz_add: string;
        nowConfirm: number;
        confirmAdd: number;
        dead: number;
        heal: number;
        date: string;
        mtime: string;
        province: string;
        city: string;
        confirm: number;
    }

    export interface RootObject {
        statisGradeCityDetail: StatisGradeCityDetail[];
    }

}

