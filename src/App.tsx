import { useState } from "react"
import Title from "./components/Title"
import Form from "./components/Form" 
import Results from "./components/Results" 
import AiSuggestion from "./components/AiSuggestion"

type ResultsState = {  
    country: string
    cityName: string
    temperature: string
    conditionText: string 
    icon: string
}  

const App = () => {
    const [city, setCity] = useState<string>("")
    const [results, setResults] = useState<ResultsState>({
        country: "",
        cityName: "",
        temperature: "", 
        conditionText: "",
        icon: ""
    })
    const [aiSuggestion, setAiSuggestion] = useState<string>("")

    const getWeather = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()  
        fetch(`https://api.weatherapi.com/v1/current.json?key=3xxxyyyzzz5&q=${city}&aqi=no`) 
            .then(res => res.json())
            .then(data => {
                setResults({
                    country: data.location.country,
                    cityName: data.location.name,
                    temperature: data.current.temp_c,
                    conditionText: data.current.condition.text,
                    icon: data.current.condition.icon
                })
                getAiSuggestion(data.location.name, data.current.temp_c)
            })
    } 

    const getAiSuggestion = (city: string, temperature: string) => {
        const prompt = `現在の天気データです。場所は${city}。気温は${temperature}度。この天気に基づいて、今日のおすすめの服装を日本語で提案してください。80文字程度で答えてください。`
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer sk-or-v1-ea791joefw929fw89wncw"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        })
        .then(res => res.json())
        .then((data => {
            setAiSuggestion(data.choices[0].message.content)    
        }))
    }

    return (
        <div className="wrapper">  
            <div className="container">
                <Title/>
                <Form setCity={setCity} getWeather={getWeather}/>
                <Results results={results}/>
                <AiSuggestion aiSuggestion={aiSuggestion}/>
            </div>
        </div>
    )
}

export default App