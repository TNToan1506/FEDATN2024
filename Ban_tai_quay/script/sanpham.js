// var app = angular.module('myApp', ['ngRoute']);
window.sanPhamCtrl= function($scope, $http) {

    // Khởi tạo sản phẩm
    $scope.product = {};
    $scope.successMessage = "";
    $scope.errorMessage = "";

    // Lấy tất cả chi tiết sản phẩm
        $scope.getAllProducts = function() {
    $http.get('http://localhost:8083/san-pham')
    .then(function(response) {
        console.log(response.data); // Kiểm tra dữ liệu trả về
            $scope.products = response.data; 
        })
        .catch(function(error) {
        $scope.errorMessage = 'Lỗi khi lấy sản phẩm: ' + error.data;
        console.error($scope.errorMessage); 
        });
        };
        $scope.getAllDanhMuc=function(){
            $http.get('http://localhost:8083/danh-muc')
            .then(function(response) {
                $scope.listDanhMuc=response.data;
            })
            .catch(function(error) {
                $scope.errorMessage = 'Lỗi khi lấy danh mục: ' + error.data;
                console.error($scope.errorMessage); 
                });
        };


        // $scope.addProduct = function(product) {
        //     // Chỉnh sửa dữ liệu trước khi gửi
        //     product.tenSP = product.tenSP.trim();
        //     product.tuoiMin = Math.max(product.tuoiMin, 0);
        //     product.tuoiMax = Math.max(product.tuoiMax, product.tuoiMin);
        //     product.idDanhMuc = '211B7832';
        //     product.idThuongHieu = '95B16137';
        //     product.trangThai = 1;
        
        //     // Gửi sản phẩm dưới dạng JSON
        //     $http.post('http://localhost:8083/san-pham/add', product, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .then(function(response) {
        //         $('#productModal').modal('hide');
        //         $scope.product = {};
        //         $scope.getAllProducts();
        //         alert('Thêm sản phẩm thành công!');
        //     })
        //     .catch(function(error) {
        //         console.error('Lỗi:', error.data);
        //         $scope.errorMessage = 'Lỗi khi thêm sản phẩm: ' + (error.data && error.data.message ? error.data.message : 'Lỗi không xác định');
        //     });
        // };
        
        $scope.addProduct = function(product) {
            const formData = new FormData();
            // Thêm thông tin sản phẩm vào FormData
            formData.append('tenSP', product.tenSP || '');
            formData.append('thanhPhan', product.thanhPhan || '');
            formData.append('congDung', product.congDung || '');
            formData.append('tuoiMin', product.tuoiMin || 0);
            formData.append('tuoiMax', product.tuoiMax || 0);
            formData.append('moTa', product.moTa || '');
            formData.append('idDanhMuc', product.idDanhMuc || '');
            formData.append('trangThai', 1);
            formData.append('idThuongHieu', "95B16137");
        
            console.log('Thông tin sản phẩm:', product);
            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
        
            // Gửi FormData lên server
            $http.post('http://localhost:8083/san-pham/add', formData, {
                headers: {
                    'Content-Type': undefined // Cho phép browser tự động thiết lập boundary
                }
            })
            .then(function(response) {  
                $('#productModal').modal('hide');
                $scope.product = {}; 
                $scope.getAllProducts();
                alert('Thêm sản phẩm thành công!');
            })
            .catch(function(error) {
                $scope.getAllProducts();
                console.error('Lỗi:', error);
                if (error.data && error.data.message) {
                    $scope.errorMessage = 'Lỗi khi thêm sản phẩm: ' + error.data.message;
                } else {
                    $scope.errorMessage = 'Lỗi không xác định: ' + JSON.stringify(error);
                }
            });
        };
    $scope.deleteProduct = function (productId) {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:8083/san-pham/delete', // Đường dẫn đến API
                data: { id: productId }, // Gửi id sản phẩm qua request body
                headers: { "Content-Type": "application/json;charset=utf-8" }
            }).then(function (response) {
                alert(response.data); // Hiển thị thông báo thành công
                // Cập nhật lại danh sách sản phẩm
                $scope.getAllProducts();
                alert(response.data); // Hiển thị thông báo thành công
                
            }, function (error) {
                $scope.getAllProducts();
                // alert(response.data); // Hiển thị thông báo thành công
            });
        }
    };
   
    $scope.updateProduct = function() {
        const formData = new FormData();
        // Thêm thông tin sản phẩm vào FormData
        formData.append('id', $scope.productDetail.id); // Lưu ID của sản phẩm
        formData.append('gia', $scope.productDetail.gia);
        formData.append('soNgaySuDung', $scope.productDetail.soNgaySuDung);
        formData.append('hdsd', $scope.productDetail.hdsd);
        formData.append('ngaySanXuat', moment($scope.productDetail.ngaySanXuat).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('hsd', moment($scope.productDetail.hanSuDung).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('ngayNhap', moment($scope.productDetail.ngayNhap).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('soLuong', $scope.productDetail.soLuong);
        formData.append('trangThai', $scope.productDetail.trangThai);
        
        // Gửi danh sách linkAnhList
        if ($scope.productDetail.linkAnhList) {
            $scope.productDetail.linkAnhList.forEach(function(link) {
                formData.append('linkAnhList', link); // Thêm đường dẫn vào FormData
            });
        }
        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        // Gửi FormData lên server
        $http.put('http://localhost:8083/chi-tiet-san-pham/update', formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': 'application/json' // Đặt Content-Type thành application/json
            }    
            })
        .then(function(response) {
            console.log('Cập nhật sản phẩm thành công: ', response.data);
            // Cập nhật lại danh sách sản phẩm
            $scope.getAllProducts(); // Tải lại danh sách sản phẩm
            $('#productModal').modal('hide'); // Đóng modal sau khi cập nhật
            alert('Cập nhật thành công!'); // Thông báo thành công
        })
        .catch(function(error) {
            // console.log(productDetail);
            console.error('Lỗi khi cập nhật sản phẩm: ', error.data.message);
            if (error.data && error.data.message) {
                console.log(productDetail);
                $scope.errorMessage = 'Lỗi khi cập nhật sản phẩm: ' + error.data.message;
            } else {
                $scope.errorMessage = 'Lỗi không xác định: ' + JSON.stringify(error);
            }
        });
    };
$scope.clearForm = function() {
    // Xóa mọi dữ liệu trong product
    $scope.product = {
        gia: '',
        soNgaySuDung: '',
        huongDanSuDung: '',
        ngaySanXuat: '',
        hanSuDung: '',
        ngayNhap: '',
        soLuong: '',
        trangThai: 1
       // Nếu bạn có thuộc tính này cho hình ảnh đã chọn
    };
    
    // Đóng modal
    $('#productModal').modal('hide');
};
    // Xem chi tiết sản phẩm
    $scope.viewDetail = function(productId) {
        const product = $scope.products.find(function(p) {
            return p.id === productId;
        });
    
        if (product) {
            // Chuyển đổi các trường số thành kiểu số
            $scope.productDetail = {
                ...product,
                soNgaySuDung: Number(product.soNgaySuDung),
                soLuong: Number(product.soLuong), // Đảm bảo là số
                // Chuyển đổi các trường khác nếu cần
                ngaySanXuat: new Date(product.ngaySanXuat),
                hsd: new Date(product.hsd),
                ngayNhap: new Date(product.ngayNhap)
            };
            $('#readData').modal('show');
        } else {
            console.error('Không tìm thấy sản phẩm với ID:', productId);
        }
    };
    // Khởi tạo
    $scope.getAllProducts();
    $scope.getAllDanhMuc();
};