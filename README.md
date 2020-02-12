# Demo of Microservices with Feathers

This project demonstrates a microservice network of [Feathers](https://feathersjs.com/) apps. Three copies of the same app are running behind an API gateway:

1. API-Gateway @ <code>localhost:3030</code>
2. Service 1 @<code>localhost:3031</code>
3. Service 2 @<code>localhost:3032</code>
4. Service 3 @<code>localhost:3033</code>

The three services are automatically announced to the gateway via the 
<a href="https://github.com/kalisio/feathers-distributed">feathers-distributed plugin</a>. 
The plugin also realizes load balancing for the calls of the three microservices through the gateway.

The three microservices provide only one simple test service, which is called <code>demo-service</code>. It has only the <code>GET</code> method implemented and accepts just one parameter. If this parameter is set to a value larger than zero, the service response will be delayed by the parameter value in milliseconds. Use this to simulate e.g. a database call. The services respond with a JSON object, containing the name of the service and the datetime of the call. 

This project is similar to the [example project](https://github.com/kalisio/feathers-distributed/tree/master/example) in feathers-distributed, but runs with Feathers 4.


## Launch

To start all apps, just run docker-compose in the project folder:

```
docker-compose up
```

This command will start four Feathers apps called ``api-gateway``, ``demo-service1``, ``demo-service2``, and ``demo-service3`` as Docker containers. The latter three are identical copies of the same app, just their port numbers are different. Also, a client will be compiled and started. You can use the client to call the three services directly or through the API gateway.

## Client 

The client is available under ``localhost:8080``. You can select the endpoint for the API calls, the the number of calls and the delay per call, e.g. for performance testing. The result of the calls is displayed together with the total run time of all calls. 

The API gateway requires authentication. Use the Login button to authenticate with a demo user.
The three services do <em>not</em> require authentication, if called directly.

![Screenshot of the client.](screenshot.png)

The screenshot is showing the result of 1000 calls to the service ``demo-service`` via the API gateway. All the instances of the demo microservice are called 333 and 334 times, respectively (nicely balanced).

BTW: The client is a Vue.js app using the [Vuetify](https://vuetifyjs.com/) UI Library.

## License

Licensed under the MIT license.
