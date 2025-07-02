import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const instruction = `You are a digital circuit design assistant with expertise in analyzing visual circuit diagrams.

Your task is to:

1. Analyze the uploaded image of a digital circuit.


2. Identify all components: logic gates, ICs, resistors, LEDs, switches, etc.


3. Count the total number of wires required, based on pin-to-pin unique physical connections.


4. For wires, each direct connection between two pins or components counts as one wire, even if the signal is shared.


5. Include wires for VCC and GND for each IC (2 per IC).


6. Do not include input & output in components part


7. do not leave any of the part in the JSON Reepose empty.


8. always maintain 100% Accuracy and give consistent answers for the same query

9. always respond to every part of the response do not send any null response.


Respond strictly in the following JSON format:



{
"component_summary": [...],
"ic_assignment": {...},
"pin_connections": [...],
"wire_count": {
"total_circuit_connections": <int>,
"total_power_connections": <int>,
"overall_total": <int>
},
"assumptions": [...]
}

🧠 Wire Counting Rules:

Each distinct connection between two physical points = 1 wire.

If one pin connects to 2 destinations, count each as a separate wire.

Include:

Input connections (A, B, C, etc.)

Internal IC pin connections

Gate output → another gate input

LED-resistor-ground wires

All power connections (VCC, GND)


Do not skip wires for shared busses. Count each fan-out connection.

Do not assume hidden internal wiring unless the IC handles it entirely.

Do not reduce count due to logical equivalence.


⚠️ Important: Ensure your wire count reflects all pin-to-pin connections from the pin table. and they must be 100% accurate and consistent. Also make sure that you do not send null responses.

Do not include any cost estimation. Respond strictly in JSON.
`;

export async function POST(req: NextRequest) {
try {
const formData = await req.formData();
const file = formData.get("image") as File;

if (!file) {  
  return NextResponse.json({ error: "No image uploaded" }, { status: 400 });  
}  

const buffer = Buffer.from(await file.arrayBuffer());  
const base64Image = buffer.toString("base64");  

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });  

const result = await model.generateContent([  
  instruction,  
  {  
    inlineData: {  
      mimeType: file.type,  
      data: base64Image,  
    },  
  },  
]);  

let text = result.response.text().trim();  

// Remove markdown-style formatting if present  
if (text.startsWith("```")) {  
  text = text.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();  
}  

const json = JSON.parse(text);  
return NextResponse.json(json);

} catch (error) {
const err = error as Error; // ✅ No 'any' type here
console.error("Circuit Analyzer error:", err);
return NextResponse.json(
{ error: err.message || "Something went wrong" },
{ status: 500 }
);
}


