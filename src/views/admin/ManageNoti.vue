<template>
  <div class="p-5">
    <h2>Quản lý thông báo</h2>

    <input v-model="title" placeholder="Tiêu đề..." />
    <textarea v-model="content" placeholder="Nội dung..."></textarea>

    <select v-model="type">
      <option value="Cá nhân">Cá nhân</option>
      <option value="Môn học">Môn học</option>
      <option value="Toàn trường">Toàn trường</option>
    </select>

    <button @click="sendNotification">Gửi thông báo</button>

    <ul>
      <li v-for="n in notifications" :key="n.notification_id">
        {{ n.name }} - {{ n.type }} - {{ n.create_day }}
      </li>
    </ul>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      notifications: [],
      name: "",
      content: "",
      type: "Toàn trường",
      subject_id: null
    };
  },
  mounted() {
    this.loadNotifications();
  },
  methods: {
    async loadNotifications() {
      const res = await fetch("/api/notifications");
      this.notifications = await res.json();
    },
    async sendNotification() {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.name,
          content: this.content,
          type: this.type,
          subject_id: this.subject_id
        })
      });
      this.loadNotifications();
    }
  }
};
</script>
  