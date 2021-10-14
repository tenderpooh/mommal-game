import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MommalPage from "./routes/MommalPage";
import "./assets/css/main.css";
import AdminPage from "./routes/AdminPage";

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/admin">
            <AdminPage />
          </Route>
          <Route path="/">
            <MommalPage />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
