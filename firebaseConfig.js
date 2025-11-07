import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyCurjikXUZEhmFR_CWPwKrBZ5R76AnCQvg",
authDomain: "flow-ai-8e7e6.firebaseapp.com",
  projectId: "flow-ai-8e7e6",
  appId: "1:907859128513:web:5af1b0e264733dc950a440"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);