<template>
    <div class="p-5">
      <h2>Lịch học của bạn</h2>
  
      <table border="1" cellpadding="10">
        <tr>
          <th>Môn học</th>
          <th>Phòng</th>
          <th>Thời gian</th>
        </tr>
  
        <tr v-for="item in schedule" :key="item.id">
          <td>{{ item.course }}</td>
          <td>{{ item.room }}</td>
          <td>{{ item.time }}</td>
        </tr>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentSchedule",
    data() {
      return {
        schedule: [
          { id: 1, course: "Công nghệ phần mềm", room: "A101", time: "Thứ 2 - 7:30" },
          { id: 2, course: "CSDL", room: "B203", time: "Thứ 4 - 9:30" },
        ],
      };
    },
  };
  </script>
  