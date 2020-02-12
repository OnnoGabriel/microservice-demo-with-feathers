import { Application } from '../declarations';
import users from './users/users.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users);

   // Initialize default user
   let userService = app.service('users');
   userService.find({})
    .then((users:any) => {
      if (users.total === 0) {
        userService.create({
          email: 'test@example.com',
          password: 'test'
        }).then(result => {
          console.log('User created!', result);
        }).catch(error => {
          console.error('Error creating user!', error);
        });
      }
    });
}
