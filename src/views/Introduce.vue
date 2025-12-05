<template>
  <div class="blog-container container-sm p-4 mx-auto">
    
    <header class="text-center mb-5">
      <h1 class="display-4 fw-bolder mb-2 text-dark">
        Trải Nghiệm Hệ thống Quản lý lịch học & tài liệu một cách toàn diện
      </h1>
      <p class="lead text-muted fst-italic">
        Từ lịch học, tài liệu đến thông báo — Dự án của <strong class="text-primary">Lê Hoàng Phúc</strong>, TP.HCM - 2025
      </p>
    </header>

    <hr class="my-4" />

    <section class="mb-5">
      <h2 class="h3 fw-bold mb-3 text-info">Bắt đầu từ một vấn đề "Cũ kỹ"</h2>
      <p class="fs-5 text-secondary mb-3">
        Khi còn là sinh viên, mình luôn cảm thấy việc quản lý thông tin học tập - từ <strong class="fw-semibold">thời khóa biểu</strong>, <strong class="fw-semibold">lịch thi</strong>, <strong class="fw-semibold">tài liệu môn học</strong>, cho đến các <strong class="fw-semibold">thông báo khẩn</strong> — còn quá thủ công và phân mảnh ở nhiều trường. Sinh viên thì phải lục lọi nhiều nơi, còn giảng viên thì mất thời gian cho những công việc hành chính lặp đi lặp lại.
      </p>
      <p class="fs-5 text-secondary">
        Chính vì sự bất tiện đó, mình đã quyết định biến nó thành một dự án cá nhân: xây dựng một <strong class="fw-semibold">nền tảng web hợp nhất</strong>, giúp việc quản lý và truy cập thông tin trở nên <strong class="text-success">dễ dàng</strong>, <strong class="text-success">trực quan</strong> và <strong class="text-success">siêu tiết kiệm thời gian</strong>.
      </p>
    </section>

    <hr class="my-4" />

    <section class="mb-5">
      <h2 class="h3 fw-bold mb-3 text-info"> Dự án này phục vụ cho ai?</h2>
      <p class="fs-5 text-secondary mb-3">
        Hệ thống được thiết kế để giải quyết nhu cầu của 3 nhóm người dùng cốt lõi trong môi trường giáo dục:
      </p>
      <ul class="list-unstyled ms-4 space-y-3 fs-5 text-secondary">
        <li class="mb-2"><span class="badge bg-primary me-2">1</span>
          <strong class="text-primary">Phòng Đào tạo/Hành chính</strong>: Quản lý <strong class="fw-semibold">cơ sở dữ liệu</strong>, thiết lập lịch học chính xác và đăng tải các thông báo chính thức.
        </li>
        <li class="mb-2"><span class="badge bg-primary me-2">2</span>
          <strong class="text-primary">Giảng viên</strong>: Tải lên <strong class="fw-semibold">tài liệu học tập</strong>, nhập điểm thành phần và gửi <strong class="fw-semibold">thông báo nhanh</strong>.
        </li>
        <li class="mb-2"><span class="badge bg-primary me-2">3</span>
          <strong class="text-primary">Sinh viên</strong>: Xem lịch học, truy cập tài liệu, tra cứu điểm số và nhận thông báo theo thời gian thực.
        </li>
      </ul>
    </section>

    <hr class="my-4" />

    <section class="mb-5">
      <h2 class="h3 fw-bold mb-3 text-info">Bộ công cụ mình đã chọn (Tech Stack)</h2>
      <p class="fs-5 text-secondary mb-3">
        Với mục tiêu xây dựng một ứng dụng hiện đại và khả năng mở rộng, mình đã sử dụng bộ công cụ sau:
      </p>
      <div class="card p-4 bg-light border-0 shadow-sm">
        <ul class="list-unstyled text-dark fs-5">
          <li class="mb-2"><strong class="text-danger">Frontend</strong>: <span class="fw-bold">Vue.js</span></li>
          <li class="mb-2"><strong class="text-success">Backend</strong>: <span class="fw-bold">Node.js + Express</span></li>
          <li class="mb-2"><strong class="text-primary">Database</strong>: <span class="fw-bold">MySQL</span></li>
          <li class="mb-2"><strong class="text-warning">Xác thực</strong>: <span class="fw-bold">JWT</span></li>
        </ul>
      </div>

      <p class="mt-4 fs-5 text-secondary">
        <strong class="fw-semibold">Sơ đồ hệ thống tổng quát</strong>:
      </p>
      <pre class="bg-dark text-white p-3 rounded shadow-lg overflow-auto font-monospace">
Client (Browser) &rarr; Frontend (Vue) &rarr; API Gateway &rarr; Backend Service (Node/Express) &rarr; MySQL DB
      </pre>
    </section>

    <hr class="my-4" />

    <section class="mb-5">
      <h2 class="h3 fw-bold mb-3 text-info">Cấu trúc dữ liệu: Nền tảng của hệ thống</h2>
      <p class="fs-5 text-secondary mb-3">
        Các bảng chính trong hệ thống:
      </p>
      <div class="card border-primary p-4 shadow-sm">
        <ul class="list-group list-group-flush fs-5">
          <li class="list-group-item"><strong class="text-dark">Students</strong>, <strong class="text-dark">Teachers</strong></li>
          <li class="list-group-item"><strong class="text-dark">Subjects</strong>, <strong class="text-dark">Schedules</strong></li>
          <li class="list-group-item"><strong class="text-dark">Materials</strong></li>
          <li class="list-group-item"><strong class="text-dark">Notifications</strong> & <strong class="text-dark">Read_Notifications</strong></li>
        </ul>
        <p class="mt-3 text-sm fst-italic text-muted">
          Các bảng được liên kết theo mô hình quan hệ để đảm bảo tính nhất quán và khả năng mở rộng.
        </p>
      </div>
    </section>

    <hr class="my-4" />

    <section class="mb-5">
      <h2 class="h3 fw-bold mb-3 text-info">Kết quả Hiện tại và Định hướng Tương lai</h2>

      <h3 class="h4 fw-semibold mb-3 text-dark">Những gì đã hoàn thiện:</h3>
      <ul class="list-group list-group-flush fs-5 mb-4">
        <li class="list-group-item border-0"><i class="bi bi-check-circle-fill text-success me-2"></i>Quản lý tài khoản và phân quyền.</li>
        <li class="list-group-item border-0"><i class="bi bi-check-circle-fill text-success me-2"></i>Quản lý môn học, lịch học và tài liệu.</li>
        <li class="list-group-item border-0"><i class="bi bi-check-circle-fill text-success me-2"></i>Gửi và nhận thông báo linh hoạt.</li>
        <li class="list-group-item border-0"><i class="bi bi-check-circle-fill text-success me-2"></i>Giao diện thân thiện, dễ thao tác.</li>
      </ul>

      <h3 class="h4 fw-semibold mt-4 mb-3 text-dark">Lời kết và Định hướng</h3>
      <p class="fs-5 text-secondary">
        Dự án này là một hành trình học hỏi thực sự. Trong tương lai, mình muốn mở rộng hệ thống với các chức năng phức tạp hơn như:
      </p>
      <ul class="list-group list-group-flush fs-5">
        <li class="list-group-item border-0"><i class="bi bi-arrow-right-short text-warning me-2"></i>Hệ thống <strong class="fw-semibold">Đăng ký Tín chỉ</strong>.</li>
        <li class="list-group-item border-0"><i class="bi bi-arrow-right-short text-warning me-2"></i>Module <strong class="fw-semibold">Quản lý Học phí</strong>.</li>
      </ul>
    </section>

    <hr class="my-4" />

    <footer class="text-center mt-4 text-muted fst-italic">
      Cảm ơn bạn đã đọc! Mọi ý kiến đóng góp xin gửi về...
    </footer>
  </div>
</template>

<script>
export default {
  name: "BlogPage",
};
</script>

<style>
.blog-container {
  width: 1200px; 
}


</style>

