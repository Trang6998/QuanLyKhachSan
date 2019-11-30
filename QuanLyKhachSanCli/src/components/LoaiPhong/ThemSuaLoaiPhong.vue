<template>
    <v-dialog v-model="dialog" width="800" persistent scrollable>
        <v-flex xs12>
            <v-card-title class="primary white--text" style="height: 40px">
                <h3>{{isUpdate ? 'Cập nhật loại phòng' : 'Thêm mới loại phòng'}}</h3>
                <v-spacer></v-spacer>
                <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
            </v-card-title>
            <v-card>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6 sm4 md3>
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

                            <!--                <v-flex xs6 sm4 md3>
                            <v-text-field v-model="loaiPhong.GiaPhong"
                                          label="GiaPhong"
                                          type="number"
                                          :error-messages="errors.collect('GiaPhong', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="GiaPhong"
                                          hide-details
                                          clearable></v-text-field>
                        </v-flex> -->
                            <v-flex xs6 sm4 md3>
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

                            <v-flex xs12>
                                <v-tabs color="primary" dark slider-color="white">
                                    <v-tab :key="1" ripple>
                                        BangGia
                                    </v-tab>
                                    <v-tab-item :key="1">
                                        <v-card flat>
                                            <v-layout row wrap>
                                                <v-flex xs6 sm4 md3>
                                                    <v-text-field v-model="bangGia.GiaPhong"
                                                                  label="Giá phòng"
                                                                  type="number"
                                                                  :error-messages="errors.collect('GiaPhong', 'frmAddEditBangGia')"
                                                                  v-validate="''"
                                                                  data-vv-scope="frmAddEditBangGia"
                                                                  data-vv-name="GiaPhong"
                                                                  hide-details
                                                                  clearable></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 sm4 md3>
                                                    <v-datepicker v-model="bangGia.ApDungTuNgay"
                                                                  label="Áp dụng từ ngày"
                                                                  type="date"
                                                                  :error-messages="errors.collect('ApDungTuNgay', 'frmAddEditBangGia')"
                                                                  v-validate="''"
                                                                  data-vv-scope="frmAddEditBangGia"
                                                                  data-vv-name="ApDungTuNgay"
                                                                  hide-details
                                                                  clearable></v-datepicker>
                                                </v-flex>
                                                <v-flex xs6 sm4 md3>
                                                    <v-datepicker v-model="bangGia.ApDungDenNgay"
                                                                  label="Áp dụng đến ngày"
                                                                  type="date"
                                                                  :error-messages="errors.collect('ApDungDenNgay', 'frmAddEditBangGia')"
                                                                  v-validate="''"
                                                                  data-vv-scope="frmAddEditBangGia"
                                                                  data-vv-name="ApDungDenNgay"
                                                                  hide-details
                                                                  clearable></v-datepicker>
                                                </v-flex>
                                                <v-flex xs6 sm4 md3>
                                                    <div class="text-xs-right">
                                                        <v-btn color="info" :disabled="loading" :loading="loading" @click.native="saveBangGia" small>Thêm mới</v-btn>
                                                    </div>
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
                                                       
                                                        <td>{{ props.item.LoaiPhong.LoaiPhongID }}</td>
                                                        <td>{{ props.item.GiaPhong }}</td>
                                                        <td>{{ props.item.ApDungTuNgay === null ? "" : props.item.ApDungTuNgay|moment('DD/MM/YYYY') }}</td>
                                                        <td>{{ props.item.ApDungDenNgay === null ? "" : props.item.ApDungDenNgay|moment('DD/MM/YYYY') }}</td>
                                                    </template>
                                                </v-data-table>
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
            </v-card>
        </v-flex>
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
        components: {
            
        },
        data() {
            return {
                dialog: false,
                isUpdate: false,
                bangGia: {} as BangGia,
                loaiPhong: {} as LoaiPhong,
                dsBangGia: [] as BangGia[],
                dsBangGiaLoading: false,
                searchBangGia: '',
                searchParamsBangGia: { includeEntities: true } as BangGiaApiSearchParams,
                tableHeaderBangGia: [
                //    { text: 'BangGiaID', value: 'BangGiaID', align: 'center', sortable: true },
                    { text: 'Mã loại phòng', value: 'LoaiPhongID', align: 'center', sortable: true },
                    { text: 'Giá phòng', value: 'GiaPhong', align: 'center', sortable: true },
                    { text: 'Áp dụng từ ngày', value: 'ApDungTuNgay', align: 'center', sortable: true },
                    { text: 'Áp dụng đến ngày', value: 'ApDungDenNgay', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsLoaiPhong: {} as LoaiPhongApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaLoaiPhong') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
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
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
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
                            BangGiaApi.insert(this.bangGia).then(res => {
                                this.bangGia.LoaiPhongID = this.loaiPhong.LoaiPhongID;
                                this.bangGia.GiaPhong = res.GiaPhong;
                                this.bangGia.ApDungTuNgay = res.ApDungTuNgay;
                                this.bangGia.ApDungDenNgay = res.ApDungDenNgay;
                                this.loading = false;
                                console.log(this.bangGia.LoaiPhongID);
                                this.$snotify.success('Thêm mới thành công!');
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
            getDataFromApiBangGia(id: number): void {
                BangGiaApi.detail(id).then(res => {
                    this.bangGia = res;
                });
            },
            saveBangGia(): void {
                this.$validator.validateAll('frmAddEditBangGia').then((res) => {
                   if (res) {
                        this.bangGia.LoaiPhong = undefined;
                       this.bangGia.ThuePhong = undefined;
                       this.bangGia.LoaiPhongID = this.loaiPhong.LoaiPhongID;
                            this.loading = true;
                            BangGiaApi.insert(this.bangGia).then(res => {
                                this.bangGia.GiaPhong = res.GiaPhong;
                                this.bangGia.ApDungTuNgay = res.ApDungTuNgay;
                                this.bangGia.ApDungDenNgay = res.ApDungDenNgay;
                                this.loading = false;
                                console.log(this.bangGia.LoaiPhongID);
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        
                    }
                });
            },
        }
    });
</script>