import { HTTP } from '@/HTTPServices'
import { BaseApi } from './BaseApi'
import { PaginatedResponse,Pagination } from './PaginatedResponse'
import { ThuocTinhPhong } from '@/models/ThuocTinhPhong'
export interface ThuocTinhPhongApiSearchParams extends Pagination {
    thuocTinhID?:number;
    phongID?:number;
}
class ThuocTinhPhongApi extends BaseApi {
    search(searchParams: ThuocTinhPhongApiSearchParams): Promise<PaginatedResponse<ThuocTinhPhong>> {

        return new Promise<PaginatedResponse<ThuocTinhPhong>>((resolve: any, reject: any) => {
            HTTP.get('thuoctinhphong', {
                params: searchParams
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    detail(id: number): Promise<ThuocTinhPhong> {
        return new Promise<ThuocTinhPhong>((resolve: any, reject: any) => {
            HTTP.get('thuoctinhphong/' + id).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    update(id: number, thuocTinhPhong: ThuocTinhPhong): Promise<ThuocTinhPhong> {
        return new Promise<ThuocTinhPhong>((resolve: any, reject: any) => {
            HTTP.put('thuoctinhphong/' + id, 
                thuocTinhPhong
            ).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    insert(thuocTinhPhong: ThuocTinhPhong): Promise<ThuocTinhPhong> {
        return new Promise<ThuocTinhPhong>((resolve: any, reject: any) => {
            HTTP.post('thuoctinhphong', 
                thuocTinhPhong
            ).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    delete(id: number): Promise<ThuocTinhPhong> {
        return new Promise<ThuocTinhPhong>((resolve: any, reject: any) => {
            HTTP.delete('thuoctinhphong/' + id)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
}
export default new ThuocTinhPhongApi();
