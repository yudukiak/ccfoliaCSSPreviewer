import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your Electron & React application.</p>
      <Button onClick={() => setCount((c) => c + 1)}>
        Click me ({count})
      </Button>
    </>
  );
}
