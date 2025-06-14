import EmailContext from "./EmialContext";


const  EmailState = (props)  => {
    return (
        <EmailState.Provider value = {{email}} >
            props.children
        </EmailState.Provider>
    )
}

export default EmailState
