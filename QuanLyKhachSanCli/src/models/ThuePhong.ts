import { BangGia } from "@/models/BangGia";
import { HoaDon } from "@/models/HoaDon";
import { Phong } from "@/models/Phong";

export interface ThuePhong {
    ThuePhongID: number;
    PhongID: number;
    HoaDonID: number;
    ThoiGianNhanPhong: Date;
    ThoiGianTraPhong: Date;
    BangGiaID: number;
    BangGia?: BangGia;
    HoaDon?: HoaDon;
    Phong?: Phong;
}
