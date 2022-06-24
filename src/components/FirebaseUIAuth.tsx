import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseui from "firebaseui";
import { useLayoutEffect, useRef } from "react";
import useScript from "react-use-scripts";

interface Props {
  config: firebaseui.auth.Config;
}

const FirebaseUIAuth = ({ config }: Props) => {
  const firebaseuiElement = useRef<HTMLDivElement | null>(null);
  const languageCode = "pt_br";

  const { ready } = useScript({
    src: `https://www.gstatic.com/firebasejs/ui/6.0.0/firebase-ui-auth__${languageCode}.js`,
  });

  useLayoutEffect(() => {
    if (ready && firebaseuiElement.current) {
      (window as any).firebase = firebase;
      const firebaseuiUMD: typeof firebaseui = (window as any).firebaseui;
      const ui = new firebaseuiUMD.auth.AuthUI(getAuth());
      ui.start(firebaseuiElement.current, config);
    }
  }, [ready, config]);

  return <div ref={firebaseuiElement} />;
};

export default FirebaseUIAuth;
