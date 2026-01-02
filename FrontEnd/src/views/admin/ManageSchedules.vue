<template>
  <div class="p-4">
    <h3>Quản lý lịch (Đơn giản)</h3>

    <div class="form">
      <!-- Department selector -->
      <select v-model="department_id" @change="onDepartmentChange">
        <option value="" disabled>Chọn khoa</option>
        <option v-for="d in departments" :key="d.department_id" :value="d.department_id">
          {{ d.department_name }}
        </option>
      </select>

      <!-- Teachers loaded by department -->
      <select v-model="teacher_id" @change="onTeacherChange">
        <option value="" disabled>Chọn giảng viên</option>
        <option v-for="t in teachers" :key="t.teacher_id" :value="t.teacher_id">{{ t.full_name }}</option>
      </select>

      <!-- Classes loaded by department (or by teacher if teacher-course-classes used) -->
      <select v-model="course_class_id" :disabled="classes.length === 0">
        <option value="" disabled>Chọn lớp</option>
        <option v-for="c in classes" :key="c.course_class_id" :value="c.course_class_id">
          {{ c.class_name || (c.subject_name ? `${c.subject_name} (${c.course_class_id})` : c.course_class_id) }}
        </option>
      </select>

      <!-- Subjects loaded by department -->
      <select v-model="subject_id" :disabled="subjects.length === 0">
        <option value="" disabled>Chọn môn</option>
        <option v-for="s in subjects" :key="s.subject_id" :value="s.subject_id">{{ s.subject_name }}</option>
      </select>

      <input type="date" v-model="day" />
      <input type="time" v-model="start_time" />
      <input type="time" v-model="end_time" />
      <input type="text" v-model="room" placeholder="Phòng học" />

      <button :disabled="!canSubmit" @click="addSchedule">Thêm</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="info">{{ message }}</div>

    <table class="mt-4" border="1" cellpadding="6">
      <thead>
        <tr>
          <th>Môn</th>
          <th>Phòng</th>
          <th>Ngày</th>
          <th>Bắt đầu</th>
          <th>Kết thúc</th>
          <th>Lớp</th>
          <th>Giảng viên</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in schedules" :key="s.schedule_id">
          <td>{{ s.subject_name || '-' }}</td>
          <td>{{ s.room }}</td>
          <td>{{ formatDate(s.day) }}</td>
          <td>{{ s.start_time }}</td>
          <td>{{ s.end_time }}</td>
          <td>{{ s.class_name || s.course_class_id }}</td>
          <td>{{ s.teacher_name || '-' }}</td>
          <td><button @click="deleteSchedule(s.schedule_id)">Xóa</button></td>
        </tr>
        <tr v-if="schedules.length === 0">
          <td colspan="8" class="muted">Chưa có lịch</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ScheduleSimple',
  data() {
    return {
      departments: [],
      teachers: [],
      classes: [],
      subjects: [],
      schedules: [],
      department_id: '',
      teacher_id: '',
      course_class_id: '',
      subject_id: '',
      day: '',
      start_time: '',
      end_time: '',
      room: '',
      loading: false,
      error: '',
      message: ''
    };
  },
  computed: {
    canSubmit() {
      return (
        this.course_class_id &&
        this.subject_id &&
        this.day &&
        this.start_time &&
        this.end_time &&
        this.room &&
        this.start_time < this.end_time
      );
    }
  },
  mounted() {
    this.loadDepartments();
    this.loadTeachers(); // load all teachers initially (or by department)
    this.loadSchedules();
  },
  methods: {
    // --- Loaders ---
    async loadDepartments() {
      this.error = '';
      try {
        const res = await fetch('http://localhost:8888/api/departments');
        if (!res.ok) { this.error = 'Không tải được danh sách khoa'; return; }
        const data = await res.json();
        this.departments = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = 'Không tải được danh sách khoa';
      }
    },

    async loadTeachers() {
      this.error = '';
      try {
        const res = await fetch('http://localhost:8888/api/teachers');
        if (!res.ok) { this.error = 'Không tải được giảng viên'; return; }
        const data = await res.json();
        this.teachers = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = 'Không tải được giảng viên';
      }
    },

    async loadTeachersByDepartment(departmentId) {
      this.error = '';
      this.teachers = [];
      this.teacher_id = '';
      if (!departmentId) return;
      try {
        const res = await fetch(`http://localhost:8888/api/teachers/byDepartment/${departmentId}`);
        if (!res.ok) { this.error = 'Không tải được giảng viên theo khoa'; return; }
        const data = await res.json();
        this.teachers = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = 'Không tải được giảng viên theo khoa';
      }
    },

    async loadClassesByDepartment(departmentId) {
      this.error = '';
      this.classes = [];
      this.course_class_id = '';
      if (!departmentId) return;
      try {
        const res = await fetch(`http://localhost:8888/api/classes/byDepartment/${departmentId}`);
        if (!res.ok) { this.error = 'Không tải được lớp theo khoa'; return; }
        const data = await res.json();
        this.classes = (Array.isArray(data) ? data : []).map(item => ({
          course_class_id: item.course_class_id ?? item.class_id ?? item.id,
          class_name: item.class_name ?? item.class_name_display ?? item.name ?? item.subject_name,
          subject_name: item.subject_name
        }));
      } catch (e) {
        this.error = 'Không tải được lớp theo khoa';
      }
    },

    async loadSubjectsByDepartment(departmentId) {
      this.error = '';
      this.subjects = [];
      this.subject_id = '';
      if (!departmentId) return;
      try {
        const res = await fetch(`http://localhost:8888/api/subjects/byDepartment/${departmentId}`);
        if (!res.ok) { this.error = 'Không tải được môn theo khoa'; return; }
        const data = await res.json();
        this.subjects = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = 'Không tải được môn theo khoa';
      }
    },

    // Called when department changes: load teachers, classes, subjects
    onDepartmentChange() {
      this.error = '';
      this.teacher_id = '';
      this.course_class_id = '';
      this.subject_id = '';
      this.classes = [];
      this.teachers = [];
      this.subjects = [];
      if (!this.department_id) return;
      this.loadTeachersByDepartment(this.department_id);
      this.loadClassesByDepartment(this.department_id);
      this.loadSubjectsByDepartment(this.department_id);
    },

    // When teacher changes: optionally load teacher-specific course_classes
    async onTeacherChange() {
      this.error = '';
      this.course_class_id = '';
      this.subject_id = '';

      if (!this.teacher_id) {
        // keep classes loaded by department
        return;
      }

      try {
        const res = await fetch(`http://localhost:8888/api/teacher-course-classes/${this.teacher_id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length) {
            this.classes = data.map(item => ({
              course_class_id: item.course_class_id ?? item.class_id ?? item.id,
              class_name: item.class_name ?? item.subject_name ?? item.name,
              subject_name: item.subject_name
            }));
          }
        }
      } catch (e) {
        // ignore and keep department classes
      }

      // also try to load teacher's subjects
      try {
        const res2 = await fetch(`http://localhost:8888/api/teacher-subjects/${this.teacher_id}`);
        if (res2.ok) {
          const data2 = await res2.json();
          this.subjects = Array.isArray(data2) ? data2 : [];
        }
      } catch (e) {
        // ignore
      }
    },

    async loadSchedules() {
      this.error = '';
      try {
        const res = await fetch('http://localhost:8888/api/schedules');
        if (!res.ok) { this.error = 'Không tải được lịch'; return; }
        const data = await res.json();
        this.schedules = (Array.isArray(data) ? data : []).map(item => ({
          ...item,
          class_name: item.class_name ?? item.subject_name ?? undefined
        }));
      } catch (e) {
        this.error = 'Không tải được lịch';
      }
    },

    formatDate(ds) {
      if (!ds) return '';
      const d = new Date(ds);
      return d.toLocaleDateString('vi-VN');
    },

    // --- Add schedule flow: check -> insert (with optional override) ---
    async addSchedule() {
      this.error = '';
      this.message = '';
      if (!this.canSubmit) {
        this.error = 'Vui lòng điền đầy đủ và đúng thời gian';
        return;
      }

      const payload = {
        course_class_id: this.course_class_id,
        subject_id: this.subject_id,
        teacher_id: this.teacher_id,
        day: this.day,
        start_time: this.start_time,
        end_time: this.end_time,
        room: this.room
      };

      this.loading = true;
      try {
        // 1) call check endpoint
        const resCheck = await fetch('http://localhost:8888/api/schedules/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const checkJson = await resCheck.json().catch(()=>({}));
        if (!resCheck.ok) {
          // mapping errors (403) or other server errors
          this.error = checkJson.error || 'Lỗi khi kiểm tra lịch';
          this.loading = false;
          return;
        }

        if (checkJson.ok === false && Array.isArray(checkJson.conflicts) && checkJson.conflicts.length) {
          // show conflicts and ask admin to confirm override
          const details = checkJson.conflicts.map(c => `${c.type}: ${c.detail}`).join('\n');
          const confirmMsg = `Phát hiện xung đột:\n${details}\n\nBạn có muốn ghi đè và thêm lịch không?`;
          const doOverride = confirm(confirmMsg);
          if (!doOverride) {
            this.error = 'Đã hủy thêm lịch do xung đột';
            this.loading = false;
            return;
          }
          // admin confirmed -> insert with override
          await this.insertSchedule({ ...payload, override: true });
          return;
        }

        // no conflicts -> insert normally
        await this.insertSchedule(payload);
      } catch (e) {
        console.error('addSchedule error:', e);
        this.error = 'Lỗi khi thêm lịch';
      } finally {
        this.loading = false;
      }
    },

    async insertSchedule(payload) {
      try {
        const res = await fetch('http://localhost:8888/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(()=>({}));
        if (!res.ok) {
          if (res.status === 409 && json.conflicts) {
            // backend returned conflicts on insert (double-check)
            const details = json.conflicts.map(c => `${c.type}: ${c.detail}`).join('\n');
            this.error = `Xung đột khi thêm: \n${details}`;
            return;
          }
          // mapping errors (403) or other
          this.error = json.error || 'Lỗi khi thêm lịch';
          return;
        }
        this.message = 'Thêm lịch thành công';
        this.resetForm();
        await this.loadSchedules();
      } catch (e) {
        console.error('insertSchedule error:', e);
        this.error = 'Lỗi khi thêm lịch';
      }
    },

    async deleteSchedule(id) {
      if (!confirm('Xóa lịch?')) return;
      try {
        const res = await fetch(`http://localhost:8888/api/schedules/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          this.error = 'Lỗi khi xóa';
          return;
        }
        this.message = 'Đã xóa';
        await this.loadSchedules();
      } catch (e) {
        console.error('deleteSchedule error:', e);
        this.error = 'Lỗi khi xóa';
      }
    },

    resetForm() {
      this.course_class_id = '';
      this.subject_id = '';
      this.day = '';
      this.start_time = '';
      this.end_time = '';
      this.room = '';
      // keep department selection so admin can add multiple schedules in same department
      // but clear teacher/class selections if desired:
      // this.teacher_id = '';
      // this.classes = [];
      // this.subjects = [];
    }
  }
};
</script>

<style scoped>
.form { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
input, select { padding:6px; border:1px solid #ccc; border-radius:4px; }
button { padding:6px 10px; background:#0b79d0; color:#fff; border:none; border-radius:4px; cursor:pointer; }
.error { color:#b00020; margin-top:8px; }
.info { color:#0b6; margin-top:8px; }
.muted { color:#666; text-align:center; padding:8px; }
</style>