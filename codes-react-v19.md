## Reactバージョン19を使った場合のコード例

```js
// Form.tsx

type FormProps = {
    getWeather: (payload: FormData) => void
}  

const Form = (props: FormProps) => {
    return (
        <form action={props.getWeather}>
            <input type="text" 
                   name="city" 
                   placeholder="都市名"
            />
            <button type="submit">
                Get Weather
            </button>
        </form>
    )
}

export default Form
```

```js
// App.tsx

import { useActionState } from "react"
import Title from "./components/Title"
import Form from "./components/Form" 
import Results from "./components/Results" 
import AiSuggestion from "./components/AiSuggestion"
import Loading from "./components/Loading"

type ResultsState = {  
    country: string
    cityName: string
    temperature: string
    conditionText: string 
    icon: string
}

type AppState = {
    results: ResultsState
    aiSuggestion: string
} | null

const App = () => {
    const getWeather = (_prevState: AppState, formData: FormData) => {
        const city = formData.get("city")

        return fetch(`https://api.weatherapi.com/v1/current.json?key=321760498a6143a89fc22958261305&q=${city}&aqi=no`)
            .then(res => res.json())
            .then(weatherData => {
                const results: ResultsState = {
                    country: weatherData.location.country,
                    cityName: weatherData.location.name,
                    temperature: weatherData.current.temp_c,
                    conditionText: weatherData.current.condition.text,
                    icon: weatherData.current.condition.icon
                }

                const prompt = `現在の天気データです。
                                場所は${weatherData.location.name}。
                                気温は${weatherData.current.temp_c}度。
                                この天気に基づいて、今日のおすすめの服装を日本語で提案してください。
                                80文字程度で答えてください。`

                return fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer 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"
                    },
                    body: JSON.stringify({
                        model: "openrouter/free",
                        messages: [{ role: "user", content: prompt }]
                    })
                })
                .then(res => res.json())
                .then(aiData => ({
                    results,
                    aiSuggestion: aiData.choices[0].message.content
                }))
            })
    }

    const [returnedData, formAction, isPending] = useActionState(getWeather, null)

    return (
        <div className="wrapper">  
            <div className="container">
                <Title/>
                <Form getWeather={formAction}/>
                {isPending ? <Loading loadingStyle="weather-loading"/> : <Results results={returnedData?.results}/>}
                {isPending ? <Loading loadingStyle="ai-loading"/> : <AiSuggestion aiSuggestion={returnedData?.aiSuggestion}/>}
            </div>
        </div>
    )
}

export default App
```


```js
// Results.tsx

type ResultsProps = {
    results?: {
        country: string
        cityName: string
        temperature: string
        conditionText: string 
        icon: string
    }
}    

const Results = (props: ResultsProps) => {
    return (
        <>          
            {props.results?.country &&
                <>
                    <div className="results-country">{props.results.country}</div>
                    <div className="results-city">{props.results.cityName}</div>
                    <div className="results-temp">{props.results.temperature} <span>°C</span></div>
                    <div className="results-condition">
                        <img src={props.results.icon} alt="icon"/>
                        <span>{props.results.conditionText}</span>
                    </div>
                </>
            }
        </>
    )
}

export default Results
```