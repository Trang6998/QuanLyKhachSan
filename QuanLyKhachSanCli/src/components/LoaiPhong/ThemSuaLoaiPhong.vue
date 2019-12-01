<template>
    <v-dialog v-model="dialog" width="100%" height="auto" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật ' : 'Thêm mới '}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <!--thong tin loại phòng ,
                bảng giá loại phòng
                ô text nhập thông tin giá loại phòng

                -->

                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout>
                            <v-toolbar-title>Thông tin loại phòng </v-toolbar-title>

                        </v-layout>
                        <v-layout row wrap>

                            <v-flex xs6 sm4 md4>
                                <v-text-field v-model="loaiPhong.TenLoaiPhong"
                                              label="Tên loại phòng"
                                              type="text"
                                              :error-messages="errors.collect('TenLoaiPhong', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="TenLoaiPhong"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm4 md4>
                                <v-text-field v-model="loaiPhong.GiaPhong"
                                              label="Gía Phòng"
                                              :error-messages="errors.collect('GiaPhong', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="GiaPhong"
                                              hide-details
                                              disabled="disabled"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm4 md4>
                                <v-text-field v-model="loaiPhong.MoTa"
                                              label="Mô tả"
                                              type="text"
                                              :error-messages="errors.collect('MoTa', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="MoTa"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs12 class="mt-4">


                                <v-layout>
                                    <v-toolbar-title>Bảng giá loại phòng </v-toolbar-title>

                                </v-layout>
                                <v-layout row wrap>

                                    <v-flex xs3 md3 sm3>
                                        <v-text-field v-model="bangGia.GiaPhong"
                                                      label="Giá phòng mới"
                                                      type="text"
                                                      :error-messages="errors.collect('GiaPhong', 'frmAddEdit')"
                                                      v-validate="''"
                                                      data-vv-scope="frmAddEdit"
                                                      data-vv-name="GiaPhong"
                                                      hide-details
                                                      clearable></v-text-field>
                                    </v-flex>
                                    <v-flex xs4 md4 sm4>
                                        <v-datepicker v-model="bangGia.ApDungTuNgay"
                                                      label="áp dụng từ ngày"
                                                      v-validate="''"
                                                      :error-messages="errors.collect('ApDungTu', 'frmAddEdit')"
                                                      data-vv-name="ApDungTu"
                                                      data-vv-scope="frmAddEdit"
                                                      hide-details
                                                      clearable>
                                        </v-datepicker>
                                    </v-flex>
                                    <v-flex xs4 md4 sm4>
                                        <v-datepicker v-model="bangGia.ApDungDenNgay"
                                                      label="áp dụng từ ngày"
                                                      v-validate="''"
                                                      :error-messages="errors.collect('ApDungDen', 'frmAddEdit')"
                                                      data-vv-name="ApDungDen"
                                                      data-vv-scope="frmAddEdit"
                                                      hide-details
                                                      clearable>
                                        </v-datepicker>
                                    </v-flex>
                                    <v-flex xs1 md1 sm1 class="pa-2">
                                        <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="saveBangGia">{{isUpdateGia ='Thêm'}}</v-btn>

                                    </v-flex>
                                </v-layout>
                                <v-card-text class="pa-0">
                                    <v-data-table :headers="tableHeaderBangGia"
                                                  :items="dsBangGia"
                                                  :pagination.sync="searchParamsBangGia"
                                                  :total-items="searchParamsBangGia.totalItems"
                                                  :loading="dsBangGiaLoading"
                                                  class="table-border table">
                                        <template slot="items" slot-scope="props">
                                            <td>{{ props.index +1 }}</td>
                                            <td>{{ props.item.GiaPhong }}</td>
                                            <td>{{ props.item.ApDungTuNgay === null ? "" : props.item.ApDungTuNgay|moment('DD/MM/YYYY') }}</td>
                                            <td>{{ props.item.ApDungDenNgay === null ? "" : props.item.ApDungDenNgay|moment('DD/MM/YYYY') }}</td>

                                            <td class="text-xs-center" style="width:80px;">
                                                <v-btn flat color="red" icon small class="ma-0" @click="confirmDeleteBangGia(props.item)">
                                                    <v-icon small>delete</v-icon>
                                                </v-btn>
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-card-text>

                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
                <v-dialog v-model="dialogConfirmDeleteBangGia" max-width="290">
                    <v-card>
                        <v-card-title class="headline">Xác nhận xóa</v-card-title>
                        <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.native="dialogConfirmDeleteBangGia=false" flat>Hủy</v-btn>
                            <v-btn color="red darken-1" @click.native="deleteBangGia" flat>Xác Nhận</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card>
        </v-container>
    </v-dialog>

</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import { BangGia } from '@/models/BangGia';
    import BangGiaApi, { BangGiaApiSearchParams } from '@/apiResources/BangGiaApi';


    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                isUpdateGia: false,
                loaiPhong: {} as LoaiPhong,
                selectedBangGia: {} as BangGia,
                dialogConfirmDeleteBangGia: false,
                dsBangGia: [] as BangGia[],
                dsBangGiaLoading: false,
                searchBangGia: '',
                searchParamsBangGia: { includeEntities: true } as BangGiaApiSearchParams,
                tableHeaderBangGia: [
                    { text: 'STT', value: '', align: 'center', sortable: true },
                    { text: 'Gía phòng', value: 'GiaPhong', align: 'center', sortable: true },
                    { text: 'áp dụng từ ngày', value: 'ApDungTuNgay', align: 'center', sortable: true },
                    { text: 'áp dụng đến ngày', value: 'ApDungDenNgay', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },

                ],

                bangGia: {} as BangGia,
                loading: false,
                searchParamsLoaiPhong: {} as LoaiPhongApiSearchParams,
            }
        },
        watch: {
        },

        created() {

        },
        methods: {
            confirmDeleteBangGia(bangGia: BangGia): void {
                this.selectedBangGia = bangGia;
                this.dialogConfirmDeleteBangGia = true;
            },

            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.dsBangGia = [];
                this.loaiPhong = item;
    //            this.loaiPhong = Object.assign({}, item);
                if (isUpdate === true) {
                    this.searchParamsBangGia.loaiPhongID = this.loaiPhong.LoaiPhongID;
                    BangGiaApi.search(this.searchParamsBangGia).then(res => {
                        this.dsBangGia = res.Data;
                    });
                }
            },

            getDataFromApi(id: number): void {
                LoaiPhongApi.detail(id).then(res => {
                    this.loaiPhong = res;
                    this.getDataFromApiBangGia(this.searchParamsBangGia);

                });
            },

            deleteBangGia(): void {
                BangGiaApi.delete(this.selectedBangGia.BangGiaID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApiBangGia(this.searchParamsBangGia);
                    this.dialogConfirmDeleteBangGia = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
            getDataFromApiBangGia(searchParamsBangGia: BangGiaApiSearchParams): void {
                this.searchParamsBangGia.loaiPhongID = this.loaiPhong.LoaiPhongID;

                BangGiaApi.search(searchParamsBangGia).then(res => {
                    this.dsBangGia = res.Data;
                    this.searchParamsBangGia.totalItems = res.Pagination.totalItems;
                    this.dsBangGiaLoading = false;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        this.loaiPhong.BangGia = undefined;
                        this.loaiPhong.DatPhong = undefined;
                        this.loaiPhong.Phong = undefined;
                        if (this.isUpdate) {
                            this.loading = true;
                            LoaiPhongApi.update(this.loaiPhong.LoaiPhongID, this.loaiPhong).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.$validator.validateAll('frmAddEditBangGia').then((res) => {
                            if (res) {
                            this.bangGia.LoaiPhong = this.loaiPhong;
                            this.bangGia.ThuePhong = undefined;
                            this.loading = true;
                            this.loaiPhong.GiaPhong = this.bangGia.GiaPhong;
                            BangGiaApi.insert(this.bangGia).then(res => {
                                this.loading = false;
                                console.log(this.bangGia.LoaiPhongID);
                                LoaiPhongApi.update(this.loaiPhong.LoaiPhongID, this.loaiPhong);
                                this.$snotify.success('Thêm mới thành công!');
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        
                            }
                        });
                        }
                    }
                });
            },
            saveBangGia(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        if (this.isUpdateGia) {
                            this.bangGia.ThuePhong = undefined;
                            this.bangGia.LoaiPhong = undefined;
                            this.loading = true;
                            this.bangGia.BangGiaID = 0;
                            this.bangGia.LoaiPhongID = this.loaiPhong.LoaiPhongID;
                            this.loaiPhong.GiaPhong = this.bangGia.GiaPhong;
                            BangGiaApi.insert(this.bangGia).then(res => {
                                this.bangGia = {} as BangGia;
                                this.loading = false;
                                this.getDSBangGia();
                                LoaiPhongApi.update(this.loaiPhong.LoaiPhongID, this.loaiPhong);
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
            },
            getDSBangGia(): void {
                BangGiaApi.search(this.searchParamsBangGia).then(res => {
                    this.dsBangGia = res.Data;
                });
            },

        }
    });
</script>

