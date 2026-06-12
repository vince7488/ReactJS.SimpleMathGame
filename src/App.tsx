import { useState } from "react";
import { StarSums } from "./components/StarSums";

export default function App() {
  const [sessionId, setSessionId] = useState(1);

  return (
    <StarSums
      key={sessionId}
      startNewSession={() =>
        setSessionId((currentSession) => currentSession + 1)
      }
    />
  );
}
