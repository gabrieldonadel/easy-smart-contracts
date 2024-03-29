import { ReactComponent as Icon } from "../../assets/images/smart-contact-icon.svg";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
} from "firebase/auth";
import FirebaseUIAuth from "../../components/FirebaseUIAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
};

const Login = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  auth.languageCode = "pt_br";

  useEffect(() => {
    const unregisterAuthObserver = getAuth().onAuthStateChanged(
      async (user) => {
        if (user) {
          navigate("/contracts", { replace: true });
        }
      }
    );
    return unregisterAuthObserver;
  }, [navigate]);

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
        <FirebaseUIAuth config={uiConfig} />
      </div>
    </div>
  );
};

export default Login;
