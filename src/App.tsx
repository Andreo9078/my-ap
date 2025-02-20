import { useElectronAPI } from "./hooks/useElectronAPI";
import { ClientLayout } from "./layouts/ClientLayout";
import "./App.css";
import { MyRequests } from "./pages/client/myRequests";
import { RequestCreation } from "./pages/client/requestCreation";

import LoginForm from "./components/LoginForm";
import { useUser } from "./contexts/currentUserContext";
import { useEffect, useState } from "react";
import { MasterLayout } from "./layouts/MasterLayout";
import { ActiveRequests } from "./pages/master/ActiveRequests";
import { DoneRequests } from "./pages/master/DoneRequests";
import ReportModal from "./components/ReportModal";

function App() {
  // const res = f.testDB()
  const { user } = useUser();
  const electronAPI = useElectronAPI();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      electronAPI.auth.role.getRole(user.id).then((role) => {
        console.log("User role:", role.dataValues.name);
        setUserRole(role.dataValues.name);
      });
    }
  }, [user]);

  switch (userRole) {
    case null:
      return <LoginForm />;
    case "client":
      return (
        <ClientLayout
          pages={
            new Map([
              ["my_requests", <MyRequests userId={user?.id} />],
              ["create_request", <RequestCreation />],
            ])
          }
        />
      );
    case "master":
      return (
        <>
          <MasterLayout
            pages={
              new Map([
                ["active_requests", <ActiveRequests userId={user?.id} />],
                ["done_requests", <DoneRequests userId={user?.id} />],
              ])
            }
          />
        </>
      );
    default:
      return <p>WTF</p>;
  }
}

export default App;
