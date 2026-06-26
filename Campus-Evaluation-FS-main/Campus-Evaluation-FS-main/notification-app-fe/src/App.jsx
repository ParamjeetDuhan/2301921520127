import { useEffect } from "react";
import { Log } from "./services/logger";

function App() {

    useEffect(() => {

        Log(
            "frontend",
            "info",
            "component",
            "Application Started"
        );

    }, []);

    return (
        <h1>Notifications App</h1>
    );
}

export default App;