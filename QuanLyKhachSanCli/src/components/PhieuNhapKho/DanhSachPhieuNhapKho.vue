<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/phieunhapkho" exact>Phiếu nhập kho</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsPhieuNhapKho"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsPhieuNhapKho"
                                :total-items="searchParamsPhieuNhapKho.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                            <td>{{ props.index }}</td>
                            <td>{{ props.item.PhieuNhapID }}</td>
                            <td>{{ props.item.NgayNhap === null ? "" : props.item.NgayNhap|moment('DD/MM/YYYY') }}</td>
                            <td>{{ props.item.TongTien }}</td>
                            <td class="text-xs-center" style="width:80px;">
                                <v-btn flat icon small :to="'/phieunhapkho/'+props.item.PhieuNhapID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deletePhieuNhapKho" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhieuNhapKhoApi, { PhieuNhapKhoApiSearchParams } from '@/apiResources/PhieuNhapKhoApi';
    import { PhieuNhapKho } from '@/models/PhieuNhapKho';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsPhieuNhapKho: [] as PhieuNhapKho[],
                tableHeader: [
                    { text: 'STT', value: 'index', align: 'center', sortable: true },
                    { text: 'ID', value: 'PhieuNhapID', align: 'center', sortable: true },
                    { text: 'Ngày nhập', value: 'NgayNhap', align: 'center', sortable: true },
                    { text: 'Tổng tiền', value: 'TongTien', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsPhieuNhapKho: { includeEntities: true, rowsPerPage: 10 } as PhieuNhapKhoApiSearchParams,
                loadingTable: false,
                selectedPhieuNhapKho: {} as PhieuNhapKho,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsPhieuNhapKho);
        },
        methods: {
            getDataFromApi(searchParamsPhieuNhapKho: PhieuNhapKhoApiSearchParams): void {
                this.loadingTable = true;
                PhieuNhapKhoApi.search(searchParamsPhieuNhapKho).then(res => {
                    this.dsPhieuNhapKho = res.Data;
                    this.searchParamsPhieuNhapKho.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(phieuNhapKho: PhieuNhapKho): void {
                this.selectedPhieuNhapKho = phieuNhapKho;
                this.dialogConfirmDelete = true;
            },
            deletePhieuNhapKho(): void {
                PhieuNhapKhoApi.delete(this.selectedPhieuNhapKho.PhieuNhapID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsPhieuNhapKho);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

