<template>
  <div class="container p-4">
    <h2 class="mb-4 text-primary fw-bold">Mở đăng ký môn học</h2>

    <!-- Chọn năm học (1-4) -->
    <div class="mb-3">
      <label class="fw-bold">Năm học (khóa trong lớp):</label>
      <select v-model.number="selectedYear" class="form-select" @change="onYearChange">
        <option disabled value="">-- Chọn năm học --</option>
        <option v-for="y in years" :key="y" :value="y">Năm {{ y }}</option>
      </select>
    </div>

    <!-- Chọn học kỳ -->
    <div v-if="semesters.length > 0" class="mb-3">
      <label class="fw-bold">Học kỳ:</label>
      <select v-model="selectedSemester" class="form-select" @change="loadSubjects">
        <option disabled value="">-- Chọn học kỳ --</option>
        <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
      </select>
    </div>

    <hr />

    <!-- Chọn khoa -->
    <div class="mb-3">
      <label class="fw-bold">Khoa:</label>
      <select v-model="selectedDepartment" class="form-select" @change="onDepartmentChange">
        <option disabled value="">-- Chọn khoa --</option>
        <option v-for="d in departments" :key="d.department_id" :value="d.department_id">
          {{ d.department_name }}
        </option>
      </select>
    </div>

    <hr />

    <!-- Khóa (cố định hiển thị) -->
    <div class="mb-3">
      <label class="fw-bold">Khóa (ví dụ):</label>
      <input type="text" class="form-control" value="22" disabled />
    </div>

    <!-- Thời gian mở/đóng đăng ký -->
    <div class="mb-3">
      <label class="fw-bold">Ngày bắt đầu:</label>
      <input type="date" v-model="day_start" class="form-control" readonly />
    </div>
    <div class="mb-3">
      <label class="fw-bold">Ngày kết thúc:</label>
      <input type="date" v-model="day_end" class="form-control" />
    </div>

    <hr />

    <!-- Tùy chọn tạo cho tất cả lớp hoặc chọn từng lớp -->
    <div class="mb-3">
     
      
      <div class="form-check">
        <input class="form-check-input" type="radio" id="scope_select" value="select" v-model="createScope" />
        Chọn lớp cụ thể:
      </div>
    </div>

    <!-- Danh sách lớp (chỉ khi chọn scope 'select') -->
    <div v-if="createScope === 'select'" class="mb-3">
      <h5>Danh sách lớp thuộc khoa (năm = {{ selectedYear || '—' }})</h5>
      <div v-if="classes && classes.length > 0">
        <div class="mb-2">
          <button class="btn btn-sm btn-outline-primary me-2" @click="toggleSelectAll">
            {{ allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
          </button>
         
        </div>

        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr>
              <th style="width:40px"></th>
              <th>Lớp</th>
              <th>Năm nhập học</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cl in filteredClassesByYear" :key="cl.class_id">
              <td>
                <input type="checkbox" v-model="selectedClassIds" :value="cl.class_id" />
              </td>
              <td>{{ cl.class_name }}</td>
              <td>{{ cl.year }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p class="text-muted">Không tìm thấy lớp phù hợp trong khoa này.</p>
      </div>
    </div>

    <hr />

    <!-- Danh sách môn học -->
    <div v-if="subjects.length > 0">
      <h4 class="text-success">Danh sách môn học (theo curriculum)</h4>
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>Mã môn</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in subjects" :key="sub.subject_id">
            <td>{{ sub.subject_id }}</td>
            <td>{{ sub.subject_name }}</td>
            <td>{{ sub.credit }}</td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex gap-2">
        <button class="btn btn-success mt-3" @click="openRegistration">Xác nhận mở đăng ký</button>
        <button class="btn btn-outline-secondary mt-3" @click="previewPlan">Xem trước danh sách sẽ tạo</button>
      </div>
    </div>

    <div v-else-if="selectedYear && selectedSemester && selectedDepartment">
      <p class="text-muted">Không có môn học nào trong curriculum cho lựa chọn này.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      years: [1, 2, 3, 4],
      semesters: [],
      selectedYear: "",
      selectedSemester: "",
      subjects: [],
      departments: [],
      selectedDepartment: "",
      classes: [],
      selectedClassIds: [],    // mảng class_id được chọn
      createScope: "all",      // 'all' | 'select'
      day_start: "",
      day_end: "",
    };
  },
  computed: {
    // Lọc classes theo năm (year) đã chọn
    filteredClassesByYear() {
      if (!this.selectedYear) return [];
      return (this.classes || []).filter(c => Number(c.year) === Number(this.getClassStartYear()));
    },
    // Kiểm tra tất cả đã chọn
    allSelected() {
      const list = this.filteredClassesByYear.map(c => c.class_id);
      if (list.length === 0) return false;
      return list.every(id => this.selectedClassIds.includes(id));
    }
  },
  async mounted() {
    this.loadDepartments();
    this.day_start = new Date().toISOString().split("T")[0];
  },
  methods: {
    onYearChange() {
      this.semesters = ["HK1", "HK2", "HK3"];
      this.selectedSemester = "";
      this.subjects = [];
      // reset selection classes
      this.selectedClassIds = [];
    },
    async loadDepartments() {
      const res = await fetch("http://localhost:8888/api/departments");
      this.departments = await res.json();
    },
    async onDepartmentChange() {
      await this.loadClasses();
      // reload subjects if semester/year already selected
      if (this.selectedYear && this.selectedSemester) {
        await this.loadSubjects();
      }
    },
    async loadClasses() {
      if (!this.selectedDepartment) return;
      const res = await fetch(`http://localhost:8888/api/classes/department/${this.selectedDepartment}`);
      this.classes = await res.json();
      // reset selectedClassIds
      this.selectedClassIds = [];
    },
    async loadSubjects() {
      if (!this.selectedYear || !this.selectedSemester || !this.selectedDepartment) return;
      const res = await fetch(
        `http://localhost:8888/api/semester-subjects?year=${this.selectedYear}&semester=${this.selectedSemester}&department=${this.selectedDepartment}`
      );
      this.subjects = await res.json();
    },
    // Lấy năm nhập học (start year) từ classes: chọn min year để map khóa nhỏ nhất
    getClassStartYear() {
      if (!this.classes || this.classes.length === 0) return null;
      // classes.year có thể là number hoặc string
      const years = this.classes.map(c => Number(c.year)).filter(y => !isNaN(y));
      if (years.length === 0) return null;
      return Math.min(...years);
    },
    // Tạo academic_year từ selectedYear (1-4) và startYear
    getAcademicYear(yearIndex, startYear) {
      if (!startYear || !yearIndex) return "";
      const begin = startYear + (yearIndex - 1);
      const end = startYear + yearIndex;
      return `${begin}-${end}`;
    },
    toggleSelectAll() {
      const list = this.filteredClassesByYear.map(c => c.class_id);
      if (this.allSelected) {
        // bỏ chọn tất cả
        this.selectedClassIds = this.selectedClassIds.filter(id => !list.includes(id));
      } else {
        // thêm tất cả
        const set = new Set(this.selectedClassIds);
        list.forEach(id => set.add(id));
        this.selectedClassIds = Array.from(set);
      }
    },
    // Xem trước danh sách sẽ được tạo (hiển thị alert đơn giản)
    previewPlan() {
      if (!this.selectedYear || !this.selectedSemester || !this.selectedDepartment) {
        alert("Vui lòng chọn Năm học, Học kỳ và Khoa trước khi xem trước.");
        return;
      }
      const startYear = this.getClassStartYear();
      const academicYear = this.getAcademicYear(this.selectedYear, startYear);
      if (!academicYear) {
        alert("Không tính được academic_year. Kiểm tra dữ liệu lớp.");
        return;
      }

      let targetText = "";
      if (this.createScope === "all") {
        targetText = `Tất cả lớp của khoa ${this.selectedDepartment} (năm ${this.selectedYear})`;
      } else {
        if (!this.selectedClassIds.length) {
          alert("Bạn chưa chọn lớp nào.");
          return;
        }
        const names = this.classes
          .filter(c => this.selectedClassIds.includes(c.class_id))
          .map(c => c.class_name)
          .join(", ");
        targetText = `Các lớp: ${names}`;
      }

      const subjCount = this.subjects.length;
      alert(`Preview:\nHọc kỳ: ${this.selectedSemester}\nAcademic year: ${academicYear}\nPhạm vi: ${targetText}\nSố môn sẽ tạo: ${subjCount}`);
    },
    async openRegistration() {
      if (!this.selectedYear) {
        alert("Vui lòng chọn Năm học (1-4).");
        return;
      }
      if (!this.selectedSemester) {
        alert("Vui lòng chọn Học kỳ.");
        return;
      }
      if (!this.selectedDepartment) {
        alert("Vui lòng chọn Khoa.");
        return;
      }
      if (!this.day_end) {
        alert("Vui lòng nhập Ngày kết thúc!");
        return;
      }
      if (this.day_end < this.day_start) {
        alert("Ngày kết thúc không được trước Ngày bắt đầu.");
        return;
      }
      if (!this.classes || this.classes.length === 0) {
        alert("Không tìm thấy lớp nào trong khoa này.");
        return;
      }

      const startYear = this.getClassStartYear();
      const academicYear = this.getAcademicYear(this.selectedYear, startYear);
      if (!academicYear) {
        alert("Không tính được năm học thực tế (academic_year).");
        return;
      }

      // Chuẩn bị payload
      const payload = {
        semester: this.selectedSemester,
        academic_year: academicYear,
        day_start: this.day_start,
        day_end: this.day_end,
        department_id: this.selectedDepartment,
        year: this.selectedYear,
      };

      if (this.createScope === "all") {
        payload.target_group = "all";
      } else {
        if (!this.selectedClassIds.length) {
          alert("Vui lòng chọn ít nhất một lớp để tạo.");
          return;
        }
        payload.target_group = "classes";
        payload.class_ids = this.selectedClassIds; // backend cần hỗ trợ nhận class_ids
      }

      try {
        const res = await fetch("http://localhost:8888/api/registration-windows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Backend error:", data);
          alert(data?.error || "Mở đăng ký thất bại");
          return;
        }

        alert("Đã mở cửa sổ đăng ký thành công!");
      } catch (err) {
        console.error("Lỗi khi mở đăng ký:", err);
        alert(err?.message || "Có lỗi xảy ra khi mở đăng ký!");
      }
    },
  },
};
</script>