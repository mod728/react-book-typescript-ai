type AiSuggestionProps = {
    aiSuggestion: string
}

const AiSuggestion = (props: AiSuggestionProps) => {
    return (
        <div>
            {props.aiSuggestion &&
                <div className="ai-suggestion">
                    <p>AIからのおすすめ</p>
                    <p>{props.aiSuggestion}</p>
                </div>
            }
        </div>
    )
}

export default AiSuggestion