<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/banggia" exact>BangGia</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsBangGia"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsBangGia"
                                :total-items="searchParamsBangGia.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.BangGiaID }}</td>
                            <td>{{ props.item.LoaiPhong.LoaiPhongID }}</td>
                    <td>{{ props.item.GiaPhong }}</td>
                            <td>{{ props.item.ApDungTuNgay === null ? "" : props.item.ApDungTuNgay|moment('DD/MM/YYYY') }}</td>
                            <td>{{ props.item.ApDungDenNgay === null ? "" : props.item.ApDungDenNgay|moment('DD/MM/YYYY') }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/banggia/'+props.item.BangGiaID" class="ma-0">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                            <v-icon small>delete</v-icon>
                        </v-btn>
                    </td>
                            </template>
                        </v-data-table>
                    </v-flex xs12>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialogConfirmDelete" max-width="290">
                    <v-card>
                <v-card-title class="headline">Xác nhận xóa</v-card-title>
                <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                    <v-btn color="red darken-1" @click.native="deleteBangGia" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import BangGiaApi, { BangGiaApiSearchParams } from '@/apiResources/BangGiaApi';
    import { BangGia } from '@/models/BangGia';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsBangGia: [] as BangGia[],
                tableHeader: [
                    { text: 'BangGiaID', value: 'BangGiaID', align: 'center', sortable: true },
                    { text: 'LoaiPhongID', value: 'LoaiPhong.LoaiPhongID', align: 'center', sortable: true },
                    { text: 'GiaPhong', value: 'GiaPhong', align: 'center', sortable: true },
                    { text: 'ApDungTuNgay', value: 'ApDungTuNgay', align: 'center', sortable: true },
                    { text: 'ApDungDenNgay', value: 'ApDungDenNgay', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsBangGia: { includeEntities: true, rowsPerPage: 10 } as BangGiaApiSearchParams,
                loadingTable: false,
                selectedBangGia: {} as BangGia,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsBangGia);
        },
        methods: {
            getDataFromApi(searchParamsBangGia: BangGiaApiSearchParams): void {
                this.loadingTable = true;
                BangGiaApi.search(searchParamsBangGia).then(res => {
                    this.dsBangGia = res.Data;
                    this.searchParamsBangGia.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(bangGia: BangGia): void {
                this.selectedBangGia = bangGia;
                this.dialogConfirmDelete = true;
            },
            deleteBangGia(): void {
                BangGiaApi.delete(this.selectedBangGia.BangGiaID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsBangGia);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

