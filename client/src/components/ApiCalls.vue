<template>
  <v-card>
    <v-card-title>
      API-Calls
    </v-card-title>
    <v-card-text>
        <v-row align="center">
        <v-col>
          <v-select
            v-model="selectedEndpoint"
            :items="endPoints"
            item-text="label"
            item-value="url"
            filled
            label="Endpoint"
            dense
          ></v-select>
          <p>
            Endpoint URL: <code>{{ serviceUrl }}/demo-service</code>
          </p>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="4">
          <v-select
            v-model="numberOfCalls"
            :items="numberOfCallsSelection"
            filled
            label="Number of calls"
            dense
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="delay"
            :items="delaySelection"
            filled
            label="Delay per call"
            dense
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-btn
            class="primary mb-4"
            :loading="loading"
            @click="performCalls"
          >
            Start Calls
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" v-if="success !== null">
        <v-col cols="6">
          <v-chip
            v-if="success"
            class="ma-2"
            color="green"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-avatar>
            {{ message }}
          </v-chip>
          <v-chip
            v-else
            class="ma-2"
            color="red"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>mdi-alert-circle</v-icon>
            </v-avatar>
            {{ message }}
          </v-chip>
        </v-col>
        <v-col cols="6">
          <div v-for="(calls, serviceId, index) in serviceCalls" :key="index">
            {{ serviceId }}: {{calls}} call(s)
          </div>
          Total time = {{ totalTS }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import io from 'socket.io-client';
import feathers from '@feathersjs/client';

export default {
  props: {
    authenticated: {
      type: Boolean,
      default: () => { return false; }
    }
  },

  data: () => ({
    endPoints: [
      {
        label: 'Service through API-Gateway',
        url: process.env.VUE_APP_API_URL
      },
      {
        label: 'Service 1 directly',
        url: process.env.VUE_APP_SERVICE1_URL
      },
      {
        label: 'Service 2 directly',
        url: process.env.VUE_APP_SERVICE2_URL
      },
      {
        label: 'Service 3 directly',
        url: process.env.VUE_APP_SERVICE3_URL
      },
    ],
    selectedEndpoint: process.env.VUE_APP_API_URL,

    numberOfCallsSelection: [ 1, 10, 100, 1000 ],
    numberOfCalls: 1,

    delaySelection: [ 0, 10, 100, 1000 ],
    delay: 0,

    loading: false,
    startTS: null,
    endTS: null,
    success: null,
    message: null,
    serviceCalls: {}
  }),

  computed: {
    totalTS: function() {
      if (this.startTS !== null) {
        if (this.endTS !== null) {
          return Math.round(this.endTS - this.startTS) + ' ms';
        }
      }
      return null;
    },
    serviceUrl: function() {
      const endpoint = this.endPoints.find(item =>
        item.url == this.selectedEndpoint
      )
      return endpoint.url;
    }
  },

  mounted() {},

  methods: {
    async performCalls() {
      this.loading = true;
      this.success = null;
      this.serviceCalls = {};
      this.endTS = null;
      this.startTS = performance.now();
      const socket = io(this.serviceUrl);
      const feathersClient = feathers();

      feathersClient.configure(feathers.socketio(socket));
      feathersClient.configure(feathers.authentication());

      // Authenticate this client?
      if (this.authenticated && this.serviceUrl === process.env.VUE_APP_API_URL) {
        try {
          await feathersClient.reAuthenticate();
        } catch(err) {
          console.error(err);
        }
      }

      let lastSuccess = false;
      let lastMessage = '';

      for (let callNo = 1; callNo <= this.numberOfCalls; callNo++) {
        try {
          const res = await feathersClient.service('demo-service').get(this.delay);
          lastSuccess = true;
          lastMessage = res.serviceId + ' @ ' + res.datetime;
          if (this.serviceCalls[res.serviceId] === undefined) {
            this.serviceCalls[res.serviceId] = 0;
          }
          this.serviceCalls[res.serviceId]++;
        } catch(err) {
          console.error(err);
          lastSuccess = false;
          lastMessage = err.message;
          callNo = this.numberOfCalls + 1
        }
      }
      this.endTS = performance.now();
      this.loading = false;
      this.success = lastSuccess;
      this.message = lastMessage;
    },

  }

};
</script>
