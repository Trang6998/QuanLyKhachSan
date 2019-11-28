<template>
    <v-app>
        <v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped"
                             v-model="drawer" enable-resize-watcher fixed app>
            <v-list>
                <v-list-tile value="true" v-for="(item, i) in items" :key="i" :to="item.link">
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app
                   :clipped-left="clipped">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
            <v-btn icon @click.stop="clipped = !clipped">
                <v-icon>web</v-icon>
            </v-btn>
            <!--<v-btn icon @click.stop="fixed = !fixed">
                <v-icon>remove</v-icon>
            </v-btn>-->
            <v-toolbar-title v-text="title"></v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height grid-list-xs style="padding:10px;">
                <v-layout justify-center>
                    <router-view></router-view>
                </v-layout>
                <vue-snotify></vue-snotify>
            </v-container>
        </v-content>
        <v-footer :fixed="fixed" app>
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>
<script>
    import "vue-snotify/styles/material.css";
    import { Vue } from 'vue-property-decorator';

    export default Vue.extend({
        name: 'App',
        data() {
            return {
                clipped: false,
                drawer: true,
                fixed: true,
                items: [
                    {
                        icon: 'list',
                        title: 'BangGia',
                        link: '/banggia',
                    },
                    {
                        icon: 'list',
                        title: 'BoPhan',
                        link: '/bophan',
                    },
                    {
                        icon: 'list',
                        title: 'ChiTietKiemKe',
                        link: '/chitietkiemke',
                    },
                    {
                        icon: 'list',
                        title: 'ChiTietPhieuNhap',
                        link: '/chitietphieunhap',
                    },
                    {
                        icon: 'list',
                        title: 'DatDichVu',
                        link: '/datdichvu',
                    },
                    {
                        icon: 'list',
                        title: 'DatPhong',
                        link: '/datphong',
                    },
                    {
                        icon: 'list',
                        title: 'DichVu',
                        link: '/dichvu',
                    },
                    {
                        icon: 'list',
                        title: 'HoaDon',
                        link: '/hoadon',
                    },
                    {
                        icon: 'list',
                        title: 'KiemKe',
                        link: '/kiemke',
                    },
                    {
                        icon: 'list',
                        title: 'KhachHang',
                        link: '/khachhang',
                    },
                    {
                        icon: 'list',
                        title: 'LoaiPhong',
                        link: '/loaiphong',
                    },
                    {
                        icon: 'list',
                        title: 'NhanVien',
                        link: '/nhanvien',
                    },
                    {
                        icon: 'list',
                        title: 'PhieuNhapKho',
                        link: '/phieunhapkho',
                    },
                    {
                        icon: 'list',
                        title: 'Phong',
                        link: '/phong',
                    },
                    {
                        icon: 'list',
                        title: 'sysdiagrams',
                        link: '/sysdiagrams',
                    },
                    {
                        icon: 'list',
                        title: 'ThuePhong',
                        link: '/thuephong',
                    },
                    {
                        icon: 'list',
                        title: 'VatDung',
                        link: '/vatdung',
                    },
                    {
                        icon: 'list',
                        title: 'VatDungPhong',
                        link: '/vatdungphong',
                    },
                ],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Title'
            };
        }
    });
</script>
