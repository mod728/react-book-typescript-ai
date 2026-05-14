type AiSuggestionProps = {
    aiSuggestion: string
}

const AiSuggestion = (props: AiSuggestionProps) => {
    return (
        <>
            {props.aiSuggestion &&
                <div className="ai-suggestion">
                    <p>AIからのおすすめ</p>
                    <p>{props.aiSuggestion}</p>
                </div>
            }
        </>
    )
}

export default AiSuggestion