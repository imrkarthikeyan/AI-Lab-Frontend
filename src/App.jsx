import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App(){


  const[prompt,setPrompt]=useState("");
  const[model,setModel]=useState("chatgpt");
  const[response,setResponse]=useState("");
  const[loading,setLoading]=useState(false);
  const[questions,setQuestions]=useState([]);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    
    setQuestions((prevQuestions)=>[
      ...prevQuestions,
      {type:"user",text:prompt}
    ])

    try{
      const res=await axios.post("http://127.0.0.1:5000/api/respond",{prompt,model,});
      setQuestions((prevQuestions)=>[
        ...prevQuestions,
        {type:"ai",text:res.data.answer || JSON.stringify(res.data)}
      ]);
      setPrompt("")
      setResponse(res.data.answer || JSON.stringify(res.data));
    }
    catch(err){
      setResponse("Error: ",err.message);
    }
    setLoading(false);
  };

  return(
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex flex-col px-6 py-12">
      <div className="max-w-3xl w-full mx-auto rounded-xl shadow-xl p-8 space-y-6 flex flex-col h-full">
        
        <div className="flex flex-col space-y-4 overflow-auto flex-grow mb-32">
          {/* <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">AI Aggregator</h1> */}
          {questions.map((q,index)=>(
            <div key={index} className={`flex ${q.type==="user" ? "justify-start" : "justify-end"}`}>
              <div className={`rounded-lg p-4 max-w-2xl text-sm ${q.type==="user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>
                <p>{q.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 w-full p-6 bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <label className="text-lg text-white">
                  <input 
                    className="text-blue-500"
                    type="radio"
                    value="chatgpt"
                    checked={model==="chatgpt"}
                    onChange={(e)=>setModel(e.target.value)}
                />
                ChatGPT
              </label>

              <label className="text-lg text-white">
                  <input 
                    className="text-purple-500"
                    type="radio"
                    value="gemini"
                    checked={model==="gemini"}
                    onChange={(e)=>setModel(e.target.value)}
                  />
                Gemini
              </label>

              <label className="text-gray-500 text-lg">
                <input
                  className="text-gray-300"
                  type="radio"
                  value="copilot"
                  disabled
                />
                Copilot (coming soon)
              </label>
            </div>

            <button
              className="px-4 py-2 bg-blue-500 text-white text-lg rounded-lg font-semibold hover:bg-blue-600 transition"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Ask"}
            </button>

          </div>

          <textarea
            className="w-full p-4 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Type your message..."
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
          />

        </div>
            

            
      </div>
    </div>  
  );
}

export default App;