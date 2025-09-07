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

    const newUserMessage={type:"user",text:prompt};
    const newHistory=[...questions.filter(q=>q.type==="user" || q.type==="ai"),newUserMessage];
    
    setQuestions((prevQuestions)=>[
      ...prevQuestions,
      newUserMessage
    ])

    if(model==="all"){
      const models=["chatgpt","gemini","deepseek"];
      const initialAnswers=models.map((m)=>({
        provider:m,
        answer:"Waiting..."
      }));

      let rowIndex;
      setQuestions((prev)=>{
        rowIndex=prev.length;
        return [...prev,{type:"ai-all",answers:initialAnswers}];
      });
      models.forEach(async(m,i)=>{
        try{
          const res=await axios.post("https://ai-lab-backend-y9bo.onrender.com/api/respond",{
            model:m,
            history:newHistory
          });
          setQuestions((prev)=>{
            const updated=[...prev];
            updated[rowIndex].answers[i]={
              provider:res.data.provider,
              answer:res.data.answer || "No response",
            };
            return updated;
          });
        }
        catch(err){
          setQuestions((prev)=>{
            const updated=[...prev];
            updated[rowIndex].answers[i]={
              provider:m,
              answer:"Error: "+err.message
            };
            return updated;
          });
        }
      });
      setPrompt("");
      setLoading(false);
      return;
    }

    try{
      const res=await axios.post("https://ai-lab-backend-y9bo.onrender.com/api/respond",{prompt,model,history:newHistory});
      setQuestions((prevQuestions)=>[
        ...prevQuestions,
        {type:"ai",text:res.data.answer || JSON.stringify(res.data)}
      ]);
      //setPrompt("")
      //setResponse(res.data.answer || JSON.stringify(res.data));
    }
    catch(err){
      setQuestions((prev)=>[
        ...prev,
        {type:"ai",text:"Error : "+err.message}
      ]);
      //setResponse("Error: "+err.message);
    }
    setPrompt("");
    setLoading(false);
  };

  return(
    <div className="min-h-screen bg-gradient-to-r bg-gray-900 flex flex-col px-6 py-12">
      <h1 className="fixed top-0 left-0 w-full text-center font-bold text-4xl text-blue-900 bg-gradient-to-r py-4 shadow-md z-50">Chaminiseek</h1>

      <div className="max-w-8xl w-full mx-auto rounded-xl shadow-xl p-8 space-y-6 flex flex-col h-full">
        
        <div className="flex flex-col space-y-4 overflow-y-auto flex-grow mb-32">
          {/* <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">AI Aggregator</h1> */}
          {questions.map((q,index)=>{
            if(q.type==="ai-all"){
              return(
                <div key={index} className="grid grid-cols-3 gap-4">
                  {q.answers.map((ans,i)=>(
                    <div key={i} className="bg-gray-700 text-white rounded-lg p-4 text-lg">
                      <p className="font-bold">{ans.provider}</p>
                      <p>{ans.answer}</p>
                    </div>
                  ))}
                </div>
              );
            }
            return(
              <div key={index} className={`flex ${q.type==="user" ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-lg p-4 max-w-8xl text-lg ${q.type==="user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>
                  <p>{q.text}</p>
                </div>
              </div>
            );
          })}
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

              <label className="text-lg text-white">
                  <input 
                    className="text-purple-500"
                    type="radio"
                    value="deepseek"
                    checked={model==="deepseek"}
                    onChange={(e)=>setModel(e.target.value)}
                  />
                DeepSeek
              </label>

              <label className="text-lg text-white">
                <input
                  className="text-green-500"
                  type="radio"
                  value="all"
                  checked={model==="all"}
                  onChange={(e)=>setModel(e.target.value)}
                />
                All
              </label>

              {/* <label className="text-gray-500 text-lg">
                <input
                  className="text-gray-300"
                  type="radio"
                  value="copilot"
                  disabled
                />
                Copilot (coming soon)
              </label> */}
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
            className="w-full p-4 bg-gray-700 rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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