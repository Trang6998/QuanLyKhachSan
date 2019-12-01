<template>
    <v-dialog v-model="dialog" width="600" persistent scrollable>
        <v-card>
            <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                <h3>{{isUpdate ? 'Cập nhật đặt phòng' : 'Thêm mới đặt phòng'}}</h3>
                <v-spacer></v-spacer>
                <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 style="padding-right: 15px">
                            <v-autocomplete v-model="datPhong.LoaiPhongID"
                                            :items="dsLoaiPhong"
                                            item-text="TenLoaiPhong"
                                            item-value="LoaiPhongID"
                                            label="Loại phòng"
                                            placeholder="Chọn loại phòng"
                                            :error-messages="errors.collect('Loại phòng', 'frmAddEdit')"
                                            v-validate="'required'"
                                            data-vv-scope="frmAddEdit"
                                            data-vv-name="Loại phòng"
                                            clearable></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 style="padding-right: 15px">
                            <v-datetimepicker v-model="datPhong.ThoiGianDat"
                                              label="Ngày thuê"
                                              required
                                              type="datetime-local"
                                              :error-messages="errors.collect('Ngày thuê', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Ngày thuê"
                                              clearable></v-datetimepicker>
                        </v-flex>
                        <v-flex xs6 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.HoTen"
                                          label="Họ tên"
                                          :error-messages="errors.collect('Họ tên', 'frmAddEdit')"
                                          v-validate="'required'"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="Họ tên"
                                          clearable></v-text-field>
                        </v-flex>
                        <v-flex xs6 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.SoDienThoai"
                                          label="Số điện thoại"
                                          type="text"
                                          :error-messages="errors.collect('Số điện thoại', 'frmAddEdit')"
                                          v-validate="'required|numeric'"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="Số điện thoại"
                                          clearable></v-text-field>
                        </v-flex>

                        <v-flex xs4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.SoLuongNguoi"
                                          label="Số lượng người"
                                          type="number"
                                          :error-messages="errors.collect('Số lượng người', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="Số lượng người"
                                          clearable></v-text-field>
                        </v-flex><br />
                        <v-flex xs4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.SoNgayDat"
                                          label="Số ngày thuê"
                                          type="number"
                                          required
                                          :error-messages="errors.collect('Số ngày thuê', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="Số ngày thuê"
                                          clearable></v-text-field>
                        </v-flex>
                        <v-flex xs4 style="padding-right: 15px">
                            <v-text-field v-model="datPhong.TienCoc"
                                          label="Tiền cọc"
                                          type="number" :min="0"
                                          :error-messages="errors.collect('Tiền cọc', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="Tiền cọc"
                                          clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-radio-group style="margin:auto" hide-details v-if="isUpdate" v-model="datPhong.TrangThai" label="Trạng thái: " row>
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
    import store from '@/store/store';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
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
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        this.datPhong.LoaiPhong = undefined;
                        if (this.datPhong.TrangThai == 2)
                            this.datPhong.NhanVienID = store.state.user.Profile.NhanVien.NhanVienID;
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
                    else {
                        this.$snotify.warning('Vui lòng nhập đủ thông tin!');
                    }
                });
            },
        }
    });
</script>

