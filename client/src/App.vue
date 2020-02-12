<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex">
         <v-toolbar-title>Client for Feathers Microservice Demo</v-toolbar-title>
      </div>
    </v-app-bar>

    <v-content class="ma-4">
      <v-row justify="center">
        <v-col xs="12" sm="10" md="8" lg="6" class="pa-4">
          <Authentication @authenticated="changeAuthenticated" />
          <ApiCalls class="mt-4" :authenticated="authenticated" />
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import Authentication from './components/Authentication';
import ApiCalls from './components/ApiCalls';

export default {
  name: 'App',

  components: {
    Authentication, ApiCalls
  },

  data: () => ({
    authenticated: false,
  }),

  methods: {
    changeAuthenticated(value) {
      this.authenticated = value
    }
  }
};
</script>

<style>
#app {
  background-color: #f0f0f0;
}
</style>
