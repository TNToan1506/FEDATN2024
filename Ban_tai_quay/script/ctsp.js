var app = angular.module('myApp', ['ngRoute']);
app.controller('myCtrl', function($scope, $http) {

    // Khởi tạo sản phẩm
    $scope.product = {};
    $scope.successMessage = "";
    $scope.errorMessage = "";

    // Lấy tất cả chi tiết sản phẩm
        $scope.getAllProducts = function() {
    $http.get('http://localhost:8083/chi-tiet-san-pham')
    .then(function(response) {
        console.log(response.data); // Kiểm tra dữ liệu trả về
    $scope.products = response.data;

        $scope.products.forEach(function(product) {
            console.log('linkAnhList:', product.linkAnhList); // Kiểm tra danh sách hình ảnh
            if (Array.isArray(product.linkAnhList)) {
                console.log('Hình ảnh hợp lệ cho sản phẩm:', product.linkAnhList);
            } else {
                console.warn('linkAnhList không hợp lệ cho sản phẩm:', product);
            }
        });
        })
        .catch(function(error) {
        $scope.errorMessage = 'Lỗi khi lấy sản phẩm: ' + error.data;
        console.error($scope.errorMessage); 
        });
        };

        $scope.addProduct = function(product) {
            const formData = new FormData();
            // Thêm thông tin sản phẩm vào FormData
            formData.append('gia', product.gia);
            formData.append('soNgaySuDung', product.soNgaySuDung);
            formData.append('hdsd', product.huongDanSuDung);
            formData.append('ngaySanXuat', moment(product.ngaySanXuat).format('YYYY-MM-DDTHH:mm:ss'));
            formData.append('hsd', moment(product.hanSuDung).format('YYYY-MM-DDTHH:mm:ss'));
            formData.append('ngayNhap', moment(product.ngayNhap).format('YYYY-MM-DDTHH:mm:ss'));
            formData.append('soLuong', product.soLuong);
            formData.append('trangThai', 1);
            formData.append('idSP',"1AB2B600");
            console.log('Thông tin sản phẩm:', product);
            // Gửi danh sách linkAnhList
            if (product.linkAnhList) {
                product.linkAnhList.forEach(function(link) {
                    formData.append('linkAnhList', link); // Thêm đường dẫn vào FormData
                });
            }
            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            // Gửi FormData lên server
            $http.post('http://localhost:8083/chi-tiet-san-pham/add', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .then(function(response) {  
                $('#productModal').modal('hide');
                // Xóa thông tin sản phẩm để form trống
                $scope.product = {}; 
                $scope.getAllProducts();
                alert('Thêm thành công!');

            })
            .catch(function(error) {
                // Kiểm tra nội dung của đối tượng lỗi
                $scope.getAllProducts();

                console.error('Lỗi:', error);
            
                // Cách hiển thị thông báo lỗi rõ ràng hơn
                if (error.data && error.data.message) {
                    $scope.getAllProducts();

                    $scope.errorMessage = 'Lỗi khi thêm sản phẩm: ' + error.data.message;
                } else {
                    $scope.getAllProducts();

                    $scope.errorMessage = 'Lỗi không xác định: ' + JSON.stringify(error);
                }
            });
        };
    // Cập nhật chi tiết sản phẩm
    $scope.deleteProduct = function (productId) {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:8083/chi-tiet-san-pham/delete', // Đường dẫn đến API
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
        formData.append('hsd', moment($scope.productDetail.hsd).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('ngayNhap', moment($scope.productDetail.ngayNhap).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('soLuong', $scope.productDetail.soLuong);
        formData.append('trangThai', $scope.productDetail.trangThai);
        formData.append('idSP',"1AB2B600");

        
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
                'Content-Type': undefined 
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
            console.error('Lỗi:', error);
            $scope.getAllProducts(); // Tải lại danh sách sản phẩm

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
                gia: Number(product.gia), // Đảm bảo là số
                soNgaySuDung: Number(product.soNgaySuDung),
                soLuong: Number(product.soLuong), // Đảm bảo là số
                // Chuyển đổi các trường khác nếu cần
                ngaySanXuat: new Date(product.ngaySanXuat),
                hsd: new Date(product.hsd),
                ngayNhap: new Date(product.ngayNhap)
            };
            if ($scope.productDetail.linkAnhList) {
                $scope.productDetail.imagePreviews = $scope.productDetail.linkAnhList;
            } else {
                $scope.productDetail.imagePreviews = []; // Nếu không có hình ảnh
            }
            // Hiển thị modal chi tiết sản phẩm
            // $('#readData').modal('show');
        } else {
            console.error('Không tìm thấy sản phẩm với ID:', productId);
        }
    };
    // Khởi tạo
    $scope.getAllProducts();

    $scope.selectImages = function(element) {
        const files = element.files; // Lấy tất cả các tệp
        $scope.product.imagePreviews = []; // Reset danh sách hình ảnh đã chọn
        $scope.product.selectedImages = []; // Tạo danh sách tệp hình ảnh
        $scope.product.linkAnhList = []; // Danh sách lưu trữ đường dẫn
    
        if (files.length > 0) {
            Array.from(files).forEach(function(file) { // Duyệt qua từng tệp
                // Tạo đường dẫn từ tệp
                const filePath = file.name; // Lấy tên tệp, bạn có thể thay đổi để lấy đường dẫn tùy theo yêu cầu
                $scope.product.linkAnhList.push('/Ban_tai_quay/img/'+filePath); // Lưu đường dẫn vào danh sách để gửi lên server
    
                const reader = new FileReader(); // Tạo FileReader để đọc tệp
                reader.onload = function(e) {
                    $scope.$apply(function() {
                        $scope.product.imagePreviews.push(e.target.result); // Thêm URL tạm thời để hiển thị ảnh
                    });
                };
                reader.readAsDataURL(file); // Đọc tệp dưới dạng URL
            });
        }
    };
});