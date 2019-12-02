<template>
    <v-dialog v-model="dialog" width="800" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật hóa đơn' : 'Thêm mới hóa đơn'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <h3>Thông tin khách hàng</h3>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout nowrap>
                                    <v-flex xs4>
                                        <v-text-field v-model="khachHang.CMND"
                                                      label="CMND" :disabled="daTonTai"
                                                      type="text"
                                                      :error-messages="errors.collect('CMND', 'frmAddEdit')"
                                                      v-validate="'required'"
                                                      data-vv-scope="frmAddEdit"
                                                      data-vv-name="CMND"></v-text-field>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-btn class="white--text" style="margin-top: 15px!important" @click="xuLyThongTinKhachHang()" small color="primary">{{daTonTai == null? 'Kiểm tra' : 'Lưu thông tin'}}</v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs4 v-if="daTonTai!=null">
                                <v-text-field v-model="khachHang.HoTen"
                                              label="Họ tên"
                                              type="text"
                                              :error-messages="errors.collect('Họ tên', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Họ tên"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs4 v-if="daTonTai!=null">
                                <v-datepicker v-model="khachHang.NgaySinh"
                                              label="Ngày sinh"
                                              type="date"
                                              :error-messages="errors.collect('Ngày sinh', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Ngày sinh"
                                              clearable></v-datepicker>
                            </v-flex>
                            <v-flex xs4 v-if="daTonTai!=null">
                                <v-radio-group v-model="khachHang.GioiTinh" row>
                                    <v-radio label="Nam" :value="true"></v-radio>
                                    <v-radio label="Nữ" :value="false"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs4 v-if="daTonTai!=null">
                                <v-text-field v-model="khachHang.SoDienThoai"
                                              label="Số điện thoại"
                                              type="text"
                                              :error-messages="errors.collect('Số điện thoại', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số điện thoại"
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs8 v-if="daTonTai!=null">
                                <v-text-field v-model="khachHang.DiaChi"
                                              label="Địa chỉ"
                                              type="text"
                                              :error-messages="errors.collect('Địa chỉ', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Địa chỉ"
                                              clearable></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <h3>Thông tin thuê phòng/ dịch vụ</h3>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="hoaDon.MaHoaDon"
                                              label="Mã hóa đơn"
                                              type="text"
                                              :error-messages="errors.collect('Mã hóa đơn', 'frmAddEdit')"
                                              v-validate="''"
                                              disabled
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Mã hóa đơn"></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-checkbox v-model="hoaDon.TrangThai"
                                            label="Xác nhận thanh toán"></v-checkbox>
                            </v-flex>
                            <v-flex xs6>
                                <v-datetimepicker v-model="hoaDon.ThoiGianNhanPhong"
                                                  label="Ngày nhận phòng"
                                                  :error-messages="errors.collect('Ngày nhận phòng', 'frmAddEdit')"
                                                  v-validate="'required'"
                                                  data-vv-scope="frmAddEdit" @input="getGiaApDung()"
                                                  data-vv-name="Ngày nhận phòng"></v-datetimepicker>
                            </v-flex>
                            <v-flex xs6>
                                <v-datetimepicker v-model="hoaDon.ThoiGianTraPhong"
                                                  label="Ngày trả phòng"
                                                  :error-messages="errors.collect('Ngày trả phòng', 'frmAddEdit')"
                                                  v-validate="''"
                                                  data-vv-scope="frmAddEdit"
                                                  data-vv-name="Ngày trả phòng"></v-datetimepicker>
                            </v-flex>
                            <v-flex xs4>
                                <v-datepicker v-model="hoaDon.NgayThanhToan"
                                              label="Ngày thanh toán"
                                              :error-messages="errors.collect('Ngày thanh toán', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Ngày thanh toán"></v-datepicker>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="hoaDon.SoTaiKhoan"
                                              label="Số tài khoản"
                                              type="text"
                                              :error-messages="errors.collect('Số tài khoản', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số tài khoản"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="hoaDon.PhuThu"
                                              label="Phụ thu"
                                              type="text"
                                              :error-messages="errors.collect('Phụ thu', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Phụ thu"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea rows="3" v-model="hoaDon.LyDo"
                                            label="Lý do phụ thu"
                                            :error-messages="errors.collect('Lý do phụ thu', 'frmAddEdit')"
                                            v-validate="''" hide-details
                                            data-vv-scope="frmAddEdit"
                                            data-vv-name="Lý do phụ thu"></v-textarea>
                            </v-flex>
                            <v-flex xs12 v-if="hoaDon.HoaDonID != null && hoaDon.HoaDonID != undefined">
                                <v-tabs>
                                    <v-tab :key="1">
                                        <b>Phòng ở</b>
                                    </v-tab>
                                    <v-tab-item :key="1">
                                        <v-card flat>
                                            <v-card-text class="pa-0">
                                                <v-layout nowrap>
                                                    <v-flex xs4>
                                                        <v-autocomplete v-model="searchParamsPhong.loaiPhongID"
                                                                        :items="dsLoaiPhong"
                                                                        :search-input.sync="searchLoaiPhong"
                                                                        item-text="TenLoaiPhong"
                                                                        item-value="LoaiPhongID"
                                                                        label="Loại phòng"
                                                                        placeholder="Chọn loại phòng"
                                                                        @change="getDSPhong()"
                                                                        clearable></v-autocomplete>
                                                    </v-flex>
                                                    <v-flex xs4>
                                                        <v-autocomplete v-model="thuePhong.PhongID"
                                                                        :items="dsPhong"
                                                                        :search-input.sync="searchPhong"
                                                                        item-text="SoPhong"
                                                                        item-value="PhongID"
                                                                        label="Phòng"
                                                                        placeholder="Chọn phòng"
                                                                        :error-messages="errors.collect('Phòng', 'frmAddEdit')"
                                                                        v-validate="''"
                                                                        data-vv-scope="frmAddEdit"
                                                                        data-vv-name="Phòng"
                                                                        clearable></v-autocomplete>
                                                    </v-flex>
                                                    <v-flex xs2>
                                                        Giá áp dụng: {{bangGia.GiaPhong}}
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <div class="text-xs-right">
                                                        <v-btn color="primary" small icon @click="themSuaThuePhong(false,{})"><v-icon>add</v-icon></v-btn>
                                                    </div>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12>
                                                        <v-data-table :headers="tableHeaderThuePhong"
                                                                      :items="dsThuePhong"
                                                                      :pagination.sync="searchParamsThuePhong"
                                                                      :total-items="searchParamsThuePhong.totalItems"
                                                                      :loading="dsThuePhongLoading"
                                                                      class="table-border table">
                                                            <template slot="items" slot-scope="props">
                                                                <td>{{ props.index + 1 }}</td>
                                                                <td>{{ props.item.SoPhong }}</td>
                                                                <td>{{ props.item.TenLoaiPhong }}</td>
                                                                <td>{{ props.item.GiaPhong }}</td>
                                                                <td class="text-xs-center" style="width:80px;">
                                                                    <v-btn flat color="red" @click="confirmDelete(props.item, null)" icon small class="ma-0">
                                                                        <v-icon small>delete</v-icon>
                                                                    </v-btn>
                                                                </td>
                                                            </template>
                                                        </v-data-table>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab :key="2">
                                        <b>Dịch vụ</b>
                                    </v-tab>
                                    <v-tab-item :key="2">
                                        <v-card flat>
                                            <v-card-text class="pa-0">
                                                <v-layout nowrap>
                                                    <v-flex xs4>
                                                        <v-autocomplete v-model="datDichVu.DichVuID"
                                                                        :items="dsDichVu"
                                                                        :search-input.sync="searchDichVu"
                                                                        item-text="TenDichVu"
                                                                        item-value="DichVuID"
                                                                        label="Dịch vụ"
                                                                        placeholder="Chọn dịch vụ"
                                                                        @change="getDichVu()"
                                                                        clearable></v-autocomplete>
                                                    </v-flex>
                                                    <v-flex xs4>
                                                        <v-text-field v-model="datDichVu.SoLuong"
                                                                      label="Số lượng đặt"
                                                                      placeholder="Nhập số lượng"
                                                                      :error-messages="errors.collect('Số lượng đặt', 'frmAddEdit')"
                                                                      v-validate="''"
                                                                      data-vv-scope="frmAddEdit"
                                                                      data-vv-name="Số lượng đặt"
                                                                      clearable></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs2>
                                                        Đơn vị tính: {{dichVu.DonViTinh}}
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <div class="text-xs-right">
                                                        <v-btn color="primary" @click="themSuaDatDichVu(false, {})" small icon><v-icon>{{isUpdateDichVu ? 'done' : 'add'}}</v-icon></v-btn>
                                                    </div>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12>
                                                        <v-data-table :headers="tableHeaderDatDichVu"
                                                                      :items="dsDatDichVu"
                                                                      :pagination.sync="searchParamsDatDichVu"
                                                                      :total-items="searchParamsDatDichVu.totalItems"
                                                                      :loading="dsDatDichVuLoading"
                                                                      class="table-border table">
                                                            <template slot="items" slot-scope="props">
                                                                <td>{{ props.index + 1 }}</td>
                                                                <td>{{ props.item.TenDichVu }}</td>
                                                                <td>{{ props.item.SoLuong }}</td>
                                                                <td>{{ props.item.GiaBan }}</td>
                                                                <td>{{ props.item.MoTa}}</td>
                                                                <td class="text-xs-center" style="width:80px;">
                                                                    <v-btn flat icon small @click="themSuaDatDichVu(true, props.item)" class="ma-0">
                                                                        <v-icon small>edit</v-icon>
                                                                    </v-btn>
                                                                    <v-btn flat color="red" icon small @click="confirmDelete(null,props.item)" class="ma-0">
                                                                        <v-icon small>delete</v-icon>
                                                                    </v-btn>
                                                                </td>
                                                            </template>
                                                        </v-data-table>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                </v-tabs>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
                <v-dialog v-model="dialogConfirmDelete" max-width="290">
                    <v-card>
                        <v-card-title class="headline">Xác nhận xóa</v-card-title>
                        <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                            <v-btn color="red darken-1" @click.native="deleteChiTietHoaDon" flat>Xác Nhận</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogThongBao" persistent max-width="290">
                    <v-card>
                        <v-card-title class="headline">Thông báo</v-card-title>
                        <v-card-text>
                            <p>Khách hàng {{daTonTai ? "đã" : "chưa"}} tồn tại trong hệ thống</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat text @click="dialogThongBao = false">Ok</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card>
        </v-container>
    </v-dialog>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import HoaDonApi, { HoaDonApiSearchParams } from '@/apiResources/HoaDonApi';
    import { HoaDon } from '@/models/HoaDon';
    import { DatDichVu } from '@/models/DatDichVu';
    import DatDichVuApi, { DatDichVuApiSearchParams } from '@/apiResources/DatDichVuApi';
    import { ThuePhong } from '@/models/ThuePhong';
    import ThuePhongApi, { ThuePhongApiSearchParams } from '@/apiResources/ThuePhongApi';
    import { KhachHang } from '@/models/KhachHang';
    import KhachHangApi, { KhachHangApiSearchParams } from '@/apiResources/KhachHangApi';
    import DichVuApi, { DichVuApiSearchParams } from '@/apiResources/DichVuApi';
    import PhongApi, { PhongApiSearchParams } from '@/apiResources/PhongApi';
    import BangGiaApi, { BangGiaApiSearchParams } from '@/apiResources/BangGiaApi';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';
    import { Phong } from '@/models/Phong';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import { DichVu } from '@/models/DichVu';
    import { BangGia } from '@/models/BangGia';
    import store from '@/store/store';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialogThongBao: false,
                daTonTai: null as any,
                isUpdate: false,
                bangGia: {} as BangGia,
                hoaDon: {} as HoaDon,
                khachHang: {} as KhachHang,
                datDichVu: {} as DatDichVu,
                thuePhong: {} as ThuePhong,
                dsDichVu: [] as DichVu[],
                dsPhong: [] as Phong[],
                dsLoaiPhong: [] as LoaiPhong[],
                searchDichVu: '',
                searchPhong: '',
                searchLoaiPhong: '',
                searchParamsDichVu: { includeEntities: true } as DichVuApiSearchParams,
                searchParamsLoaiPhong: { includeEntities: true } as LoaiPhongApiSearchParams,
                searchParamsPhong: { includeEntities: true } as PhongApiSearchParams,
                dsDatDichVu: [] as DatDichVu[],
                dsDatDichVuLoading: false,
                searchDatDichVu: '',
                searchParamsDatDichVu: { includeEntities: true } as DatDichVuApiSearchParams,
                tableHeaderDatDichVu: [
                    { text: '#', value: 'DatDichVuID', align: 'center', sortable: true },
                    { text: 'Tên dịch vụ', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'Số lượng đặt', value: 'DichVuID', align: 'center', sortable: true },
                    { text: 'Giá bán', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'Mô tả', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'Thao tác', value: 'HoaDonID', align: 'center', sortable: true },
                ],
                dsThuePhong: [] as ThuePhong[],
                dsThuePhongLoading: false,
                searchThuePhong: '',
                searchParamsThuePhong: { includeEntities: true } as ThuePhongApiSearchParams,
                tableHeaderThuePhong: [
                    { text: '#', value: 'ThuePhongID', align: 'center', sortable: true },
                    { text: 'Số phòng', value: 'PhongID', align: 'center', sortable: true },
                    { text: 'Loại phòng', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'Giá phòng', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'Thao tác', value: 'HoaDonID', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsHoaDon: {} as HoaDonApiSearchParams,
                dialog: false,
                selectedDatDichVu: {} as DatDichVu,
                selectedThuePhong: {} as ThuePhong,
                dialogConfirmDelete: false,
                isUpdateDichVu: false,
                dichVu: {} as DichVu
            }
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.daTonTai = null as any;
                this.$validator.errors.clear("frmAddEdit");
                this.hoaDon = Object.assign({}, item);
                this.khachHang = {} as KhachHang;
                this.thuePhong = {} as ThuePhong;
                this.datDichVu = {} as DatDichVu;
                this.dsDatDichVu = [] as DatDichVu[];
                this.dsThuePhong = [] as ThuePhong[];
                this.getDSLoaiPhong();
                this.getDSDichVu();
                this.isUpdateDichVu = false;
                this.isUpdate = isUpdate;
                if (this.isUpdate !== true) {
                    this.hoaDon = {} as HoaDon;
                }
                else {
                    this.daTonTai = true;
                    this.getDataFromApi(this.hoaDon.HoaDonID);
                }
            },
            xuLyThongTinKhachHang() {
                if (this.daTonTai == null) {
                    KhachHangApi.kiemtra(this.khachHang.CMND).then(res => {
                        this.dialogThongBao = true
                        if (res == null)
                            this.daTonTai = false
                        else {
                            this.daTonTai = true;
                            this.khachHang = res;
                        }
                    });
                }
                if (this.daTonTai == false) {
                    KhachHangApi.insert(this.khachHang).then(res => {
                        this.khachHang = res;
                        this.$snotify.success('Thêm mới khách hàng thành công!');
                    }).catch(res => {
                        this.$snotify.error('Thêm mới khách hàng thất bại!');
                    })
                }
                if (this.daTonTai == true) {
                    KhachHangApi.update(this.khachHang.KhachHangID, this.khachHang).then(res => {
                        this.khachHang = res;
                        this.$snotify.success('Cập nhật khách hàng thành công!');
                    }).catch(res => {
                        this.$snotify.error('Cập nhật khách hàng thất bại!');
                    })
                }
            },
            getDataFromApi(id: number): void {
                HoaDonApi.detail(id).then(res => {
                    this.hoaDon = res;
                    this.dsThuePhong = res.ThuePhong as any;
                    this.dsDatDichVu = res.DatDichVu as any;
                    this.khachHang = res.KhachHang as any;
                });
            },
            getDSPhong(): void {
                this.searchParamsPhong.ngayNhanPhong = this.hoaDon.ThoiGianNhanPhong;
                PhongApi.search(this.searchParamsPhong).then(res => {
                    this.getGiaApDung();
                    this.dsPhong = res.Data;
                });
            },
            getDSLoaiPhong(): void {
                LoaiPhongApi.search(this.searchParamsLoaiPhong).then(res => {
                    this.dsLoaiPhong = res.Data;
                });
            },
            getDSDichVu(): void {
                DichVuApi.search(this.searchParamsDichVu).then(res => {
                    this.dsDichVu = res.Data;
                });
            },
            getDichVu(): void {
                DichVuApi.detail(this.datDichVu.DichVuID).then(res => {
                    this.dichVu = res;
                });
            },
            getGiaApDung(): void {
                if (this.searchParamsPhong.loaiPhongID != null && this.searchParamsPhong.loaiPhongID != undefined) {
                    var thoiGian = this.$moment(this.hoaDon.ThoiGianNhanPhong).format("DD/MM/YYYY hh:mm");
                    BangGiaApi.giaapdung(thoiGian,
                        this.searchParamsPhong.loaiPhongID as any).then(res => {
                            this.bangGia = res
                        })
                }
            },
            getDSThuePhong() {
                this.searchParamsThuePhong.hoaDonID = this.hoaDon.HoaDonID;
                ThuePhongApi.search(this.searchParamsThuePhong).then(res => {
                    this.dsThuePhong = res.Data;
                })
            },
            getDSDatDichVu() {
                this.searchParamsDatDichVu.hoaDonID = this.hoaDon.HoaDonID;
                DatDichVuApi.search(this.searchParamsDatDichVu).then(res => {
                    this.dsDatDichVu = res.Data;
                })
            },
            themSuaThuePhong(isUpdate: boolean, item: any) {
                this.thuePhong.BangGiaID = this.bangGia.BangGiaID;
                this.thuePhong.HoaDonID = this.hoaDon.HoaDonID;
                if (isUpdate == true) {

                }
                else {
                    ThuePhongApi.insert(this.thuePhong).then(res => {
                        this.thuePhong = {} as ThuePhong;
                        this.searchParamsPhong.loaiPhongID = null as any;
                        this.getDSThuePhong();
                    });
                }
            },
            themSuaDatDichVu(isUpdate: boolean, item: any) {
                this.datDichVu.HoaDonID = this.hoaDon.HoaDonID;
                if (isUpdate == true) {
                    DatDichVuApi.detail(item.DatDichVuID).then(res => {
                        this.datDichVu = res;
                        this.isUpdateDichVu = true;
                    });
                }
                else {
                    if (this.isUpdateDichVu == true) {
                        DatDichVuApi.update(this.datDichVu.DatDichVuID, this.datDichVu).then(res => {
                            this.datDichVu = {} as DatDichVu;
                            this.isUpdateDichVu = false;
                            this.getDSDatDichVu();
                            this.$snotify.success('Cập nhật thành công!');
                        }).catch(res => {
                            this.loading = false;
                            this.$snotify.error('Cập nhật thất bại!');
                        });
                    }
                    else {
                        DatDichVuApi.insert(this.datDichVu).then(res => {
                            this.datDichVu = {} as DatDichVu;
                            this.isUpdateDichVu = false;
                            this.getDSDatDichVu();
                        });
                    }

                }
            },
            confirmDelete(item1: ThuePhong, item2: DatDichVu): void {
                this.selectedThuePhong = item1;
                this.selectedDatDichVu = item2;
                this.dialogConfirmDelete = true;
            },
            deleteChiTietHoaDon(): void {
                if (this.selectedDatDichVu != null) {
                    DatDichVuApi.delete(this.selectedDatDichVu.DatDichVuID).then(res => {
                        this.$snotify.success('Xóa thành công!');
                        this.getDSDatDichVu();
                        this.dialogConfirmDelete = false;
                    }).catch(res => {
                        this.$snotify.error('Xóa thất bại!');
                    });
                }
                if (this.selectedThuePhong != null) {
                    ThuePhongApi.delete(this.selectedThuePhong.ThuePhongID).then(res => {
                        this.$snotify.success('Xóa thành công!');
                        this.getDSThuePhong();
                        this.dialogConfirmDelete = false;
                    }).catch(res => {
                        this.$snotify.error('Xóa thất bại!');
                    });
                }
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        this.hoaDon.DatPhong = undefined;
                        this.hoaDon.NhanVien = undefined;
                        this.hoaDon.KhachHang = undefined;
                        this.hoaDon.DatDichVu = undefined;
                        this.hoaDon.ThuePhong = undefined;
                        if (this.isUpdate) {
                            this.loading = true;
                            HoaDonApi.update(this.hoaDon.HoaDonID, this.hoaDon).then(res => {
                                this.loading = false;
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            this.hoaDon.KhachHangID = this.khachHang.KhachHangID;
                            this.hoaDon.NhanVienID = store.state.user.Profile.NhanVien.NhanVienID;
                            HoaDonApi.insert(this.hoaDon).then(res => {
                                this.hoaDon = res;
                                this.isUpdate = true;
                                this.loading = false;
                                this.$emit("getLaiDanhSach");
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
            },
        }
    });
</script>