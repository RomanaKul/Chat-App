import axios from "axios";
import "./App.css";
import { UserContextProvider } from "./user/UserContext";
import Routes from "./routes/Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;
  return (
    <>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </>
  );
}

export default App;
