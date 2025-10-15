import {UserController} from "../controllers/user-controller";
import {Router}  from "express";
import { AuthGuard } from "../middleware/auth-guard-utill";
//  let router:any = express.Router()
export class  routings {
    router:Router;
    userController : UserController;
    authGuard : AuthGuard
constructor(){
    this.userController = new UserController();
    this.authGuard =new AuthGuard()
this.router = Router();
this.initializeApiRoutes()
}

initializeApiRoutes(){
this.router.post('/create', this.userController.createUser.bind(this.userController));
this.router.get(
    '/list', 
    this.authGuard.verifyToken.bind( this.authGuard), 
    this.userController.GetUsersList.bind(this.userController)
);
this.router.delete(
    '/delete/:id',
    this.authGuard.verifyToken.bind( this.authGuard),
     this.userController.DeleteUser.bind(this.userController)
    );
this.router.put(
    '/update/:id',
    this.authGuard.verifyToken.bind( this.authGuard),
     this.userController.UpdateTheUserData.bind(this.userController)
    );
this.router.post(
    '/login',
     this.userController.UserLogin.bind(this.userController)
    );
this.router.post(
    '/forget/password',
     this.userController.resetPassword.bind(this.userController)
    );
this.router.post(
    '/reset/password/:token',
     this.userController.forgetPassword.bind(this.userController)
    );
}
}

