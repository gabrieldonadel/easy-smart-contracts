import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { ReactComponent as Icon } from "../../assets/images/smart-contact-icon.svg";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/editor",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const Login = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <div
        style={{
          flex: 1,
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 400, margin: 20 }}>
          <Icon height={100} width={100} />
          <h1>Easy Smart Contracts</h1>
          <p>
            Uma plataforma web low-code com enfoque em usabilidade que
            possibilita a criação e implantação de contratos inteligentes na
            rede Ethereum
          </p>
          <button onClick={async () => {}}>test</button>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    </div>
  );
};

export default Login;
