<template>
  <div class="container p-4">
    <h2 class="mb-4 text-primary fw-bold">Đăng ký môn học</h2>

    <div v-if="message" class="alert" :class="messageTypeClass" role="alert">
      {{ message }}
    </div>

    <div v-if="availableCourses.length > 0">
      <h4 class="text-success">Danh sách môn học mở đăng ký</h4>
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th></th><th>Mã môn</th><th>Tên môn học</th><th>Số tín chỉ</th><th>Học kỳ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in availableCourses" :key="c.course_class_id">
            <td><input type="checkbox" v-model="selectedCourses" :value="c.course_class_id" /></td>
            <td>{{ c.subject_id }}</td>
            <td>{{ c.subject_name }}</td>
            <td>{{ c.credit }}</td>
            <td>{{ c.semester }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success mt-3" @click="saveEnrollment" :disabled="selectedCourses.length === 0">Lưu đăng ký</button>
    </div>

    <div v-else>
      <p class="text-muted">Hiện chưa có môn học nào được mở đăng ký.</p>
    </div>

    <div v-if="enrolledCourses.length > 0" class="mt-4">
      <h4 class="text-primary">Môn học đã đăng ký</h4>
      <ul class="list-group">
        <li v-for="e in enrolledCourses" :key="e.enrollment_id" class="list-group-item">
          {{ e.subject_name }} ({{ e.semester }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      availableCourses: [],
      selectedCourses: [],
      enrolledCourses: [],
      studentId: null,
      message: '',            // thông báo cho người dùng
      messageType: 'info'     // 'info' | 'success' | 'warning' | 'danger'
    };
  },
  computed: {
    messageTypeClass() {
      switch (this.messageType) {
        case 'success': return 'alert-success';
        case 'warning': return 'alert-warning';
        case 'danger': return 'alert-danger';
        default: return 'alert-info';
      }
    }
  },
  async mounted() {
    try {
      const user_id = localStorage.getItem('user_id');
      console.log("localStorage user_id:", user_id);
      if (!user_id) {
        console.error("Không tìm thấy user_id trong localStorage");
        this.message = 'Bạn chưa đăng nhập.';
        this.messageType = 'warning';
        return;
      }

      const res = await fetch(`http://localhost:8888/api/students/user/${user_id}`);
      console.log("/students/user status:", res.status, "content-type:", res.headers.get('content-type'));
      if (!res.ok) {
        const text = await res.text();
        console.error('/students/user lỗi:', res.status, text);
        this.message = 'Lỗi khi lấy thông tin sinh viên.';
        this.messageType = 'danger';
        return;
      }
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        console.error('/students/user trả không phải JSON:', text);
        this.message = 'Server trả dữ liệu không hợp lệ.';
        this.messageType = 'danger';
        return;
      }

      const student = await res.json();
      console.log("student (raw):", student);
      console.log("student (stringified):", JSON.stringify(student, null, 2));

      // Resolve studentId from multiple possible shapes
      let sid = null;
      if (student?.student_id) sid = student.student_id;
      else if (student?.data?.student_id) sid = student.data.student_id;
      else if (Array.isArray(student) && student[0]?.student_id) sid = student[0].student_id;
      else if (student?.data && Array.isArray(student.data) && student.data[0]?.student_id) sid = student.data[0].student_id;
      else if (student?.id) sid = student.id;

      console.log("resolved studentId:", sid);
      this.studentId = sid;

      if (!this.studentId) {
        console.error("Không lấy được studentId từ response. Kiểm tra cấu trúc response.");
        this.message = 'Không xác định được thông tin sinh viên.';
        this.messageType = 'danger';
        return;
      }

      await this.loadAvailableCourses();
      await this.loadEnrolledCourses();
    } catch (err) {
      console.error("Lỗi mounted:", err);
      this.message = 'Đã xảy ra lỗi khi khởi tạo trang.';
      this.messageType = 'danger';
    }
  },
  methods: {
    async loadAvailableCourses() {
      if (!this.studentId) {
        console.warn("studentId chưa có, bỏ qua loadAvailableCourses");
        this.availableCourses = [];
        return;
      }

      try {
        const res = await fetch(`http://localhost:8888/api/course-classes/${this.studentId}`);
        console.log(`/course-classes/${this.studentId} status:`, res.status, "ct:", res.headers.get('content-type'));

        if (!res.ok) {
          const text = await res.text();
          console.error('/course-classes lỗi:', res.status, text);
          this.message = 'Lỗi khi lấy danh sách môn mở đăng ký.';
          this.messageType = 'danger';
          this.availableCourses = [];
          return;
        }

        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const text = await res.text();
          console.error('/course-classes trả không phải JSON:', text);
          this.message = 'Server trả dữ liệu không hợp lệ.';
          this.messageType = 'danger';
          this.availableCourses = [];
          return;
        }

        const data = await res.json();
        console.log("Raw available courses response:", data);

        // Nếu backend trả object { courses: [...], message: '...' }
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else if (Array.isArray(data.courses)) arr = data.courses;
        else if (Array.isArray(data.data)) arr = data.data;
        else if (Array.isArray(data.results)) arr = data.results;
        else if (Array.isArray(data.items)) arr = data.items;
        else {
          const firstArray = Object.values(data).find(v => Array.isArray(v));
          if (firstArray) arr = firstArray;
        }

        // Gán bằng spread để Vue nhận reactivity
        this.availableCourses = Array.isArray(arr) ? [...arr] : [];

        // Hiển thị message nếu backend trả message
        if (data && typeof data.message === 'string' && (!this.availableCourses.length)) {
          this.message = data.message;
          this.messageType = 'info';
        } else if (!this.availableCourses.length) {
          this.message = 'Hiện chưa có môn mở đăng ký cho đợt này.';
          this.messageType = 'info';
        } else {
          this.message = '';
        }

        console.log("normalized availableCourses:", this.availableCourses);
      } catch (err) {
        console.error("Lỗi loadAvailableCourses:", err);
        this.message = 'Lỗi khi tải danh sách môn.';
        this.messageType = 'danger';
        this.availableCourses = [];
      }
    },

    async loadEnrolledCourses() {
      if (!this.studentId) return;
      try {
        const res = await fetch(`http://localhost:8888/api/enrollments/${this.studentId}`);
        if (!res.ok) {
          const text = await res.text();
          console.error('/enrollments lỗi:', res.status, text);
          this.enrolledCourses = [];
          return;
        }
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const text = await res.text();
          console.error('/enrollments trả không phải JSON:', text);
          this.enrolledCourses = [];
          return;
        }
        const data = await res.json();
        this.enrolledCourses = Array.isArray(data) ? [...data] : (Array.isArray(data.enrollments) ? [...data.enrollments] : []);
      } catch (err) {
        console.error('Lỗi loadEnrolledCourses:', err);
        this.enrolledCourses = [];
      }
    },

    async saveEnrollment() {
      if (!this.selectedCourses.length) {
        alert('Vui lòng chọn ít nhất một môn để đăng ký.');
        return;
      }

      try {
        const res = await fetch("http://localhost:8888/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: this.studentId, course_class_ids: this.selectedCourses })
        });

        const ct = res.headers.get('content-type') || '';
        let data = {};
        if (ct.includes('application/json')) data = await res.json();
        else {
          const text = await res.text();
          console.warn('enrollments POST trả không phải JSON:', text);
        }

        if (res.ok) {
          alert("Đăng ký thành công!");
          this.selectedCourses = [];
          await this.loadEnrolledCourses();
          await this.loadAvailableCourses(); // cập nhật nếu cần
          this.message = 'Đăng ký thành công.';
          this.messageType = 'success';
        } else {
          console.error('Đăng ký thất bại:', data);
          alert(data.message || "Đăng ký thất bại");
          this.message = data.message || 'Đăng ký thất bại.';
          this.messageType = 'danger';
        }
      } catch (err) {
        console.error("Lỗi saveEnrollment:", err);
        alert("Đã xảy ra lỗi khi đăng ký.");
        this.message = 'Lỗi khi gửi yêu cầu đăng ký.';
        this.messageType = 'danger';
      }
    }
  }
};
</script>