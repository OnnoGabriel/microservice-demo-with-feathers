<template>
  <v-card>
    <v-card-title>
      Authentication
    </v-card-title>
    <v-card-text>
      <div v-if="!authenticated">
        <v-btn
          class="primary"
          :loading="loading"
          @click="authenticate"
        >
          Login
        </v-btn>
      </div>
      <div v-else>
        <v-btn
          class="primary"
          :loading="loading"
          @click="logout"
        >
            Logout
        </v-btn>
      </div>
      <p v-if="!authenticated">
        You are <em>not</em> authenticated.
      </p>
      <p v-else>
        You are authenticated.
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import feathersClient from '../feathers-client'

export default {
  data: () => ({
    authenticated: null,
    accountExists: false,
    loading: false
  }),

  watch: {
    authenticated: {
      handler (value, oldValue) {
        if (value !== oldValue) {
          this.$emit('authenticated', value);
        }
      }
    }
  },

  async mounted() {
    this.reAuthenticate();
  },

  methods: {
    async authenticate() {
      this.loading = true;
      try {
        await feathersClient.authenticate({
          strategy: 'local',
          email: 'test@example.com',
          password: 'test'
        });
        this.authenticated = true;
      } catch(err) {
        this.authenticated = false;
        console.error(err);
      }
      this.loading = false;
    },

    async reAuthenticate() {
      this.loading = true;
      try {
        await feathersClient.reAuthenticate();
        this.authenticated = true;
      } catch(err) {
        this.authenticated = false;
        console.error(err);
      }
      this.loading = false;
    },

    async logout() {
      this.loading = true;
      try {
        await feathersClient.logout();
        this.authenticated = false;
      } catch(err) {
        console.error(err);
      }
      this.loading = false;
    }
  }

};
</script>
