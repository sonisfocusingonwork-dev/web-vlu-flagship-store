# models3d/

Thư mục chứa các mô hình 3D **thực tế** (`.glb` / `.gltf`, khuyến nghị nén Draco) cho trang Chi tiết sản phẩm.

Cấu trúc đề xuất:

```
models3d/
  <product.id>/
    <product.id>.glb
```

Sau khi thêm file, khai báo trong `frontend/assets/js/models-3d-registry.js`.
Sản phẩm không được khai báo sẽ tự động ẩn nút **3D View** và dùng Photo Gallery.

> Không đặt mô hình giả / sai hình dáng cho sản phẩm chưa có file thật.
