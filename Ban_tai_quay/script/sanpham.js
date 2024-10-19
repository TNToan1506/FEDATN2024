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
            formData.append('hdsd', product.hdsd);
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
        formData.append('id', $scope.productDetail.id || '');
        formData.append('tenSP', $scope.productDetail.tenSP || '');
        formData.append('thanhPhan', $scope.productDetail.thanhPhan || '');
        formData.append('congDung', $scope.productDetail.congDung || '');
        formData.append('tuoiMin', $scope.productDetail.tuoiMin || 0);
        formData.append('tuoiMax', $scope.productDetail.tuoiMax || 0);
        formData.append('hdsd', $scope.productDetail.hdsd);
        formData.append('moTa', $scope.productDetail.moTa || '');
        formData.append('idDanhMuc',  $scope.productDetail.idDanhMuc || '');
        formData.append('trangThai', 1);
        formData.append('idThuongHieu', "95B16137");
    
        // Gửi FormData lên server
        $http.put('http://localhost:8083/san-pham/update', formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined // Cho phép browser tự động thiết lập boundary
            }
        })
        .then(function(response) {
            $scope.getAllProducts(); // Tải lại danh sách sản phẩm
            $('#userForm').modal('hide'); // Đóng modal sau khi cập nhật
            alert('Cập nhật thành công!');
        })
        .catch(function(error) {
            $scope.getAllProducts(); // Tải lại danh sách sản phẩm
            $scope.errorMessage = error.data && error.data.message ? 'Lỗi khi cập nhật sản phẩm: ' + error.data.message : 'Lỗi không xác định: ' + JSON.stringify(error);
        });
    };
    $scope.clearForm = function() {
        $scope.productDetail = {}; // Xóa dữ liệu chi tiết sản phẩm
        $scope.product={};
        $('#userForm').modal('hide'); // Đóng modal
        $('#productModal').modal('hide'); // Đóng modal
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
            };
            // $('#readData').modal('show');
        } else {
            console.error('Không tìm thấy sản phẩm với ID:', productId);
        }
    };
    // Khởi tạo
    $scope.getAllProducts();
    $scope.getAllDanhMuc();
};