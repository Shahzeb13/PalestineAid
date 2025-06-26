import "./LandingPage.css"
const LandingPage = () => {

    return (

        <div className="container">
            <div className="imageContainer">
                <img src="../../../../Images/background.png" alt="" />
            </div>
            <div className="rightSection">
                <h1>Even A Smallest Act Of Kindness <br /> Can Change the world</h1>
                <div className="calltoactionbutton">
                <button className="donater">Donate Now</button>
                <button className="Reciever">Recieve Now</button>
                </div>
                
            </div>
        </div>

    )
}

export default LandingPage;