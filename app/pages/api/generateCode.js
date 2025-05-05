// pages/api/generate-code.js
import { spawn } from "child_process";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { query } = req.body;
  if (!query) {
    res.status(400).json({ message: "No query provided" });
    return;
  }

  // Spawn the Python process (ensure Python is installed and accessible)
  const pythonProcess = spawn("python3", ["scripts/generate_code.py", query]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      res.status(500).json({ message: "Python script error", code });
    } else {
      res.status(200).json({ generatedCode: result });
    }
  });
}
