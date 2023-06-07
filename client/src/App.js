import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Poll } from "./pages/Poll";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { CreatePoll } from "./pages/CreatePoll";

function App() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io("http://localhost:4040");
        setSocket(socket);
        return () => socket.disconnect();
    }, [setSocket]);

    if(!socket) {
        return;
    }
  
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path={"/"} element={<Home />} socket={socket} />
                        <Route path={'/polls/:id'} element={<Poll socket={socket} />} />
                        <Route path={'/polls/create'} element={<CreatePoll />} />
                        <Route path={"*"} element={<Home />} socket={socket} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;