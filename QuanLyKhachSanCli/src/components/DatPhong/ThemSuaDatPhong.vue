<template>
    <v-dialog v-model="dialog" width="600" persistent scrollable>
        <v-card>
            <v-card-title class="primary white--text" style="height: 3.5em">
                <v-flex xs4>
                    <h3>{{isUpdate ? 'CẬP NHẬT ĐẶT PHÒNG' : 'ĐẶT PHÒNG'}}</h3>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                    <div class="text-xs-right">
                        <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                    </div>
                </v-flex>
            </v-card-title>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md4 style="padding-right: 15px">
                            <v-autocomplete v-model="datPhong.LoaiPhongID"
                                            :items="dsLoaiPhong"
                                            item-text="TenLoaiPhong"
                                            item-value="LoaiPhongID"
                                            label="Loại phòng"
                                            placeholder="Chọn loại phòng"
                                            :rules="text"
                                            required
                                            :error-messages="errors.collect('LoaiPhongID', 'frmAddEdit')"
                                            v-validate="''"
                                            data-vv-scope="frmAddEdit"
                                            data-vv-name="LoaiPhongID"
                                            clearable></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md6 style="padding-right: 15px">
                            <v-datetimepicker v-model="datPhong.ThoiGianDat"
                                              label="Ngày thuê"
                                              :rules="text"
                                              required
                                              type="datetime-local"
                                              :error-messages="errors.collect('ThoiGianDat', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="ThoiGianDat"
                                              clearable></v-datetimepicker>
                        </v-flex>
                        <v-flex xs6 sm4 md4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.HoTen"
                                          label="Họ tên"
                                          type="text"
                                          :rules="text"
                                          required
                                          :error-messages="errors.collect('HoTen', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="HoTen"
                                          clearable></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.SoDienThoai"
                                          label="Số điện thoại"
                                          type="text"
                                          :rules="SDT"
                                          required
                                          :error-messages="errors.collect('SoDienThoai', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="SoDienThoai"
                                          clearable></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.SoLuongNguoi"
                                          label="Số người ở"
                                          type="number"
                                          :error-messages="errors.collect('SoLuongNguoi', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="SoLuongNguoi"
                                          clearable></v-text-field>
                        </v-flex><br />
                        <v-flex xs6 sm4 md4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.SoNgayDat"
                                          label="Số ngày thuê"
                                          type="number"
                                          :rules="text"
                                          required
                                          :error-messages="errors.collect('SoNgayDat', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="SoNgayDat"
                                          clearable></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.TienCoc"
                                          label="Tiền cọc"
                                          type="number"
                                          :error-messages="errors.collect('TienCoc', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="TienCoc"
                                          clearable></v-text-field>
                        </v-flex>
                        <v-flex md12>
                            <v-radio-group v-if="isUpdate" v-model="datPhong.TrangThai" label="Trạng thái" row>
                                <v-radio label="Đã đặt" :value="0"></v-radio>
                                <v-radio label="Đã nhận" :value="1"></v-radio>
                                <v-radio label="Đã hủy" :value="2"></v-radio>
                            </v-radio-group>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { DatPhong } from '@/models/DatPhong';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                SDT: [v => !!v || 'SDT is required',
                      v => (v && v.length == 10) || '10 characters'],
                text: [v => !!v || 'required'],
                dialog: false,
                isUpdate: false,
                datPhong: {} as DatPhong,
                dsLoaiPhong: [] as LoaiPhong[],
                dsHoaDonLoading: false,
                searchHoaDon: '',
                loading: false,
                searchParamsDatPhong: {} as DatPhongApiSearchParams,
            }
        },
        watch: {
        },
        created() {
            this.getLoaiPhong();
        },
        mounted() {
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.isUpdate = isUpdate;
                this.datPhong = item;
                this.dialog = true;
            },
            getLoaiPhong(): void {
                var search = {} as LoaiPhongApiSearchParams;
                LoaiPhongApi.search(search).then(
                    res => {
                        this.dsLoaiPhong = res.Data;
                    });
            },
            getDataFromApi(id: number): void {
                DatPhongApi.detail(id).then(res => {
                    this.datPhong = res;
                });
            },
            save(): void {
                if (this.datPhong.HoTen.length == 0 || this.datPhong.LoaiPhongID == null || this.datPhong.SoDienThoai.length == 0
                    || this.datPhong.TienCoc == null || this.datPhong.SoNgayDat == null || this.datPhong.ThoiGianDat == null) {
                    this.$snotify.warning('Vui lòng nhập thông tin!');
                    return;
                }
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                       this.datPhong.LoaiPhong = undefined;
                       this.datPhong.NhanVienID = 1;// lấy nhân viên đăng nhập
                        if (this.isUpdate) {
                            this.loading = true;
                            DatPhongApi.update(this.datPhong.DatPhongID, this.datPhong).then(res => {
                                this.loading = false;
                                this.$emit("getDatPhong");
                                this.dialog = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            DatPhongApi.insert(this.datPhong).then(res => {
                                this.datPhong = res;
                                this.isUpdate = true;
                                this.$emit("getDatPhong");
                                this.dialog = false;
                                this.loading = false;
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

