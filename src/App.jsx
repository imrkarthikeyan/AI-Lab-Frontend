import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App(){


  const[prompt,setPrompt]=useState("");
  const[model,setModel]=useState("chatgpt");
  const[response,setResponse]=useState("");
  const[loading,setLoading]=useState(false);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try{
      const res=await axios.post("http://127.0.0.1:5000/api/respond",{prompt,model,});
      setResponse(res.data.answer || JSON.stringify(res.data));
    }
    catch(err){
      setResponse("Error: ",err.message);
    }
    setLoading(false);
  };

  return(
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex flex-col justify-center items-center px-6 py-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-8 space-y-8">
        
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">AI Aggregator</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                rows="6"
                className="w-full p-6 border-2 border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={prompt}
                onChange={(e)=>setPrompt(e.target.value)}
                placeholder="Enter your question..."
              />
            </div>

            <div className="flex space-x-8 text-lg">
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="radio"
                  value="chatgpt"
                  checked={model==="chatgpt"}
                  onChange={(e)=>setModel(e.target.value)}
                  className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <span>ChatGPT</span>
              </label>
              
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="radio"
                  value="gemini"
                  checked={model==="gemini"}
                  onChange={(e)=>setModel(e.target.value)}
                  className="h-5 w-5 text-purple-500 focus:ring-2 focus:ring-purple-500"
                />
                <span>Gemini</span>
              </label>
              
              <label className="flex items-center space-x-2 text-gray-400">
                <input
                  type="radio"
                  value="copilot"
                  disabled
                  className="h-5 w-5 text-gray-300"
                />
                <span>Copilot (coming soon 🚧)</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Loading..." : "Ask"}
            </button>
          </form>
        </div>

  
        {response && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Response</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;