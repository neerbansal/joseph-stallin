import React, { useState } from "react";
import { LandingPage } from "./LandingPage";
import { Desktop } from "./Desktop";

function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <LandingPage onGetStarted={() => setStarted(true)} />;
  }

  return <Desktop />;
}

export default App;
