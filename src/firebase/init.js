import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";
import config from "./config";
class Firebase {
  constructor() {
    this.app = firebase.initializeApp(config);
    this.auth = this.app.auth();
    this.db = this.app.firestore();
    this.sendInvitation = firebase.functions().httpsCallable("sendInvitation");
    this.log = console.log;
    // this.app
    //   .firestore()
    //   .enablePersistence()
    //   .then(() => this.log("Persistence working!"))
    //   .catch(this.log);
    this.app
      .firestore()
      .enablePersistence()
      .then(() => {
        console.log("Persistence working!");
      })
      .catch(err => {
        if (err.code === "failed-precondition") {
          console.log(
            "Multiple tabs open. So, no offline persistence for you."
          );
        } else if (err.code === "unimplemented") {
          console.log("Offline persistence not supported in this browser.");
        }
      });
  }
  googleSignIn = props => {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.auth
      .signInWithRedirect(provider)
      .then(() => firebase.auth().getRedirectResult())
      .then(this.log)
      .catch(error => {
        props.history.push("/login");
        this.log(error);
      });
  };
  generateOTP = async mobile => {
    const self = this;
    if (mobile) {
      if (window.cordova) {
        console.log("Inside init (1) ");
        return await window.cordova.plugins.firebase.auth
          .verifyPhoneNumber("+91" + mobile, 0)
          .then(verificationId => {
            console.log("Inside init (2) ", verificationId);
            this.verificationId = verificationId;
          })
          .catch(err => {
            console.log("generateotp (3)", err);
            this.verificationId = null;
            return err;
          });
      } else {
        // firebase.auth().settings.appVerificationDisabledForTesting = true;
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "sign-in-button",
          {
            size: "invisible",
            callback: function(response) {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              console.log("test", response);
              return response;
            }
          }
        );
        var appVerifier = window.recaptchaVerifier;
        return firebase
          .auth()
          .signInWithPhoneNumber("+91" + mobile, appVerifier)
          .then(confirmationResult => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            self.verificationId = confirmationResult.verificationId;
            console.log(self.verificationId);
          })
          .catch(error => {
            this.verificationId = null;
            console.log("web phone auth", error);
            return error;
          });
      }
    } else return new Error("Mobile number not valid.");
  };
  mobileSignIn = async otp => {
    if (this.verificationId !== null) {
      console.log("inside otp 1", this.verificationId);
      var credential = await firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        otp
      );
      console.log("inside otp 2", credential);

      return firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          //this.verificationId = null;

          if (error === "auth/code-expired") {
            this.verificationId = null;
          }
          console.log(4, error);
          return error;
        });
    }
  };

  logOut = props =>
    this.auth.signOut().then(() => {
      localStorage.removeItem("admin"); // Remove authenticated user from localstorage
      props.history.push("/"); // After logout redirect to app's entry point
    }, this.log); // then(Success callback, Error Callback)
  signInAnonymously = () => this.auth.signInAnonymouslyAndRetrieveData();
}
export default Firebase;
