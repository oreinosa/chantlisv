import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, Subject, BehaviorSubject, of } from 'rxjs';

import { User } from '../shared/classes/user';
import { Link } from '../shared/classes/link';
import { SignIn } from '../shared/classes/sign-in';
import { SignUp } from '../shared/classes/sign-up';

import { CategoriesService } from './../admin/categories/categories.service';
import { NotificationsService } from '../notifications/notifications.service';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  user: Observable<User>;

  _links: Link[];
  _actions: Link[];
  linksSubject: BehaviorSubject<Link[]>;
  actionsSubject: BehaviorSubject<Link[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private categoriesService: CategoriesService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {
    this._links = [
      { label: 'Menu', route: 'menu', icon: 'shopping_cart' }
    ];
    this._actions = [];

    this.actionsSubject = new BehaviorSubject<Link[]>([
      { label: 'Ingresar', route: 'ingresar', icon: 'person' },
      { label: 'Registrarse', route: 'registrarse', icon: 'person_add' }
    ]);
    this.linksSubject = new BehaviorSubject<Link[]>(this._links);

    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth
      .authState
      .pipe(
        switchMap(user => {
          // console.log('Firebase user : ', user);
          if (user) {
            const doc = this.afs.collection<User>('users').doc<User>(user.uid);
            return doc
              .snapshotChanges()
              .pipe(
                map(doc => {
                  if (doc.payload.exists) {
                    let user: User = doc.payload.data();
                    user.id = doc.payload.id;
                    return user;
                  }
                  return null;
                })
              );
          } else {
            return of(null)
          }
        })
      );
  }

  get currentUserObservable(): any {
    return this.afAuth.authState;
  }

  get authenticated(): boolean {
    return this.afAuth.auth.currentUser !== null;
  }

  setRouting(role: string = '') {
    console.log(`Set routing for ${role}`);
    this._actions = [];
    this._links = [
      { label: 'Menu', route: 'menu', icon: 'shopping_cart' }
    ];
    switch (role) {
      case 'Admin':
        this._actions.push(
          { label: 'Admin', route: 'admin', icon: 'build' },
        );
        this._links.push(
          { label: 'Ordenes', route: 'ordenes', icon: 'assignment' }
        );
      case 'Cliente':
        this._actions.push(
          { label: 'Perfil', route: 'perfil', icon: 'person' },
        );
        break;
      default:

        this._actions.push(
          { label: 'Ingresar', route: 'ingresar', icon: 'person' },
          { label: 'Registrarse', route: 'registrarse', icon: 'person_add' }
        );
    }
    this.actionsSubject.next(this._actions);
    // this.router.navigate(['menu']);
    this.linksSubject.next(this._links);
  }

  signInEmail(signIn: SignIn) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(signIn.email, signIn.password)
      .catch((e) =>
        // console.log(e));
        this.notificationsService.show('Correo electrónico o contraseaña incorrecta', 'Error', 'danger'))
      .then((credential) =>
        // console.log(credential))
        this.notificationsService.show(`Hola, ${credential.displayName}`, undefined, 'info'));

  }

  signInSocial(provider: string) {
    let _provider;
    switch (provider) {
      case 'google':
        _provider = new firebase.auth.GoogleAuthProvider();
    }
    return this.afAuth
      .auth
      .signInWithPopup(_provider)
      .catch(e => console.log(e))
      .then(credential => this.updateUserData(credential.user)
        .then(() => this.notificationsService.show(`Hola, ${credential.user.displayName}`, undefined, 'info')))
  }

  signUp(signUp: SignUp) {
    return this.afAuth
      .auth
      .createUserWithEmailAndPassword(signUp.email, signUp.password)
      .catch((e) => this.notificationsService.show('Correo electrónico ya esta en uso', 'Error', 'danger'))
      .then(credential => credential.updateProfile({ // UPDATE FIREBASE USER CREDENTIALS
        displayName: signUp.name,
        photoURL: 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png'
      })
        .then(() => this.updateUserData(credential, signUp))) // UPDATE FIRESTORE USER DATA
      .then(() => this.notificationsService.show(`Bienvenido, ${signUp.name}`, undefined, 'success'));
  }

  signOut() {
    return this.afAuth.auth
      .signOut()
      .then(() => {
        this.router.navigate(['']);
        this.notificationsService.show('Adiós!', undefined, 'info');
      });
  }

  forgotPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  updateWorkplace(workplace: string, user: User) {
    return this.afs
      .doc(`users/${user.id}`)
      .set({ workplace: workplace }, { merge: true })
      .then(() => this.notificationsService.show('Lugar de trabajo actualizado!', undefined, 'success'));
  }

  private updateUserData(user, signUp?: SignUp) {
    // Sets user data to firestore on login
    // console.log(user, signUp);
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    return userRef
      .ref
      .get()
      .then(doc => {
        if (!doc.exists) {
          let data: User = {
            email: user.email,
            name: user.displayName,
            role: 'Cliente',
            photoURL: user.photoURL,
            balance: 0,
            credit: 0
          };
          if (signUp) {
            console.log(`Workplace : ${signUp.workplace}`)
            data.workplace = signUp.workplace;
          }
          return userRef.set(data, { merge: true });
        }
      });
  }
}