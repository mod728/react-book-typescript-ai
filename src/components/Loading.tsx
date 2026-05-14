type LoadingProps = {
    loadingStyle: string
}

const Loading = (props: LoadingProps) => {
    return (
        <div className={props.loadingStyle}></div>
    )
}

export default Loading