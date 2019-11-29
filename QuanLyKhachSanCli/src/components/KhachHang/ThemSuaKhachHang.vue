<template>
    <v-dialog v-model="dialog" width="600" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật khách hàng' : 'Thêm mới khách hàng'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field v-model="khachHang.HoTen"
                                              label="Họ tên"
                                              type="text"
                                              :error-messages="errors.collect('Họ tên', 'frmAddEdit')"
                                              v-validate="'required|alpha'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Họ tên"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-radio-group v-model="khachHang.GioiTinh" row>
                                    <v-radio label="Nam" value="true"></v-radio>
                                    <v-radio label="Nữ" value="false"></v-radio>
                                </v-radio-group>
                            </v-flex>
                            <v-flex xs4>
                                <v-datepicker v-model="khachHang.NgaySinh"
                                              label="Ngày sinh"
                                              type="date"
                                              :error-messages="errors.collect('Ngày sinh', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Ngày sinh"
                                              clearable></v-datepicker>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="khachHang.SoDienThoai"
                                              label="Số điện thoại"
                                              type="text"
                                              :error-messages="errors.collect('Số điện thoại', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số điện thoại"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="khachHang.CMND"
                                              label="CMND"
                                              type="text"
                                              :error-messages="errors.collect('CMND', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="CMND"
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs12>
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
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-dialog>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import KhachHangApi, { KhachHangApiSearchParams } from '@/apiResources/KhachHangApi';
    import { KhachHang } from '@/models/KhachHang';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                khachHang: {} as KhachHang,
                dialog: false,
                loading: false,
                searchParamsKhachHang: {} as KhachHangApiSearchParams,
            }
        },
        watch: {
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.$validator.errors.clear("frmAddEdit");
                this.isUpdate = isUpdate;
                if (this.isUpdate !== true) {
                    this.khachHang = {} as KhachHang;
                }
                else {
                    this.getDataFromApi(this.khachHang.KhachHangID);
                }
            },
            getDataFromApi(id: number): void {
                KhachHangApi.detail(id).then(res => {
                    this.khachHang = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.khachHang.HoaDon = undefined;
                        if (this.isUpdate) {
                            this.loading = true;
                            KhachHangApi.update(this.khachHang.KhachHangID, this.khachHang).then(res => {
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
                            KhachHangApi.insert(this.khachHang).then(res => {
                                this.khachHang = res;
                                this.isUpdate = true;
                                this.loading = false;
                                this.dialog = false;
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

