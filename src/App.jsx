import Aurora from "./Aurora.jsx";
import GlassNav from "./GlassNav.jsx";
import RotatingText from "./rotatingText.jsx";
import Waves from "./waves.jsx";
import BlurText from "./BlurText";
import FlowingMenu from "./FlowingMenu";
import webDevImg from "./assets/webDev.png";
import softwareImg from "./assets/software.png";
import mern from "./assets/mern.png";
import frameworkImg2 from "./assets/Frameworks2.png";
import ProfileCard from "./ProfileCard";
import MagicBento from "./MagicBento";
import GradientText from './GradientText.jsx';
import ColorBends from './ColorBends.jsx';
import ChromaGrid from './ChromaGrid';
import TextType from './TextType';

const items = [

    {
        image: "https://www.medschoolcoach.com/wp-content/uploads/2023/01/ReflexArcs-Fig2.jpg",
        title: "Reflex Arc Demonstration and lots of other things",
        subtitle: "BioTech",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py"
    },

    {
        image: "https://www.medschoolcoach.com/wp-content/uploads/2023/01/ReflexArcs-Fig2.jpg",
        title: "Reflex Arc Demonstration",
        subtitle: "BioTech",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py"
    },
    {
        image: "https://www.medschoolcoach.com/wp-content/uploads/2023/01/ReflexArcs-Fig2.jpg",
        title: "Reflex Arc Demonstration",
        subtitle: "BioTech",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py"
    },
    {
        image: "https://www.medschoolcoach.com/wp-content/uploads/2023/01/ReflexArcs-Fig2.jpg",
        title: "Reflex Arc Demonstration",
        subtitle: "BioTech",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py"
    },
    {
        image: "https://www.medschoolcoach.com/wp-content/uploads/2023/01/ReflexArcs-Fig2.jpg",
        title: "Reflex Arc Demonstration",
        subtitle: "BioTech",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py"
    },
    {
        image: "https://www.medschoolcoach.com/wp-content/uploads/2023/01/ReflexArcs-Fig2.jpg",
        title: "Reflex Arc Demonstration",
        subtitle: "BioTech",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py"
    }

];
const demoItems = [
    { link: "#", text: "Python, C, C++", image: softwareImg },
    { link: "#", text: "HTML5 CSS3 JavaScript", image: webDevImg },
    { link: "#", text: "Mongo, Express, React, Node ", image: mern },
    { link: "#", text: "MATLAB, NumPy, Pandas, Django, Flask", image: frameworkImg2 }
];

function App() {
    const handleAnimationComplete = () => {
    };

    const colorBendsBoxStyle = {
        width: "80%",
        height: "750px"
    };

    return (
        <main className="page-content">
            <GlassNav />

            <div>
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <div className="hero-center">
                <div className="hero-inner">
                    <BlurText
                        text="Hello. I'm Abhilash Kar."
                        delay={750}
                        animateBy="words"
                        direction="top"
                        onAnimationComplete={handleAnimationComplete}
                        className="text-2xl mb-8"
                    />

                    <div className="hero-card">
                        <div className="hero-waves-bg">
                            <Waves
                                lineColor="#2e8b57"
                                backgroundColor="rgba(255, 255, 255, 0.2)"
                                waveSpeedX={0.02}
                                waveSpeedY={0.01}
                                waveAmpX={40}
                                waveAmpY={20}
                                friction={0.9}
                                tension={0.01}
                                maxCursorMove={120}
                                xGap={12}
                                yGap={36}
                            />
                        </div>

                        <div className="hero-content">
                            <div className="hero-role">
                                <span className="hero-prefix">I am a</span>

                                <button type="button" className="btn btn-primary rotating-btn">
                                    <span className="rotating-text-wrapper">
                                        <RotatingText
                                            texts={[
                                                "Full Stack Developer",
                                                "Software Developer",
                                                "API Engineer",
                                                "MERN Stack Developer",
                                                "Tech Enthusiast"
                                            ]}
                                            mainClassName="rotating-text-inner"
                                            staggerFrom={"last"}
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            exit={{ y: "-120%" }}
                                            staggerDuration={0.025}
                                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                            rotationInterval={2000}
                                        />
                                    </span>
                                </button>
                            </div>

                            <ProfileCard />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space">            </div>

            <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
            >
                Things I dabble in
            </GradientText>


            <div className="colorbends-section">
                <div className="colorbends-box" style={colorBendsBoxStyle}>
                    <div className="colorbends-bg">
                        <ColorBends
                            colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
                            rotation={0}
                            speed={0.2}
                            scale={1}
                            frequency={1}
                            warpStrength={1}
                            mouseInfluence={1}
                            parallax={0.6}
                            noise={0.08}
                            transparent
                        />

                        </div>
                    <div className="flowing-menu-container">
                        <div style={{ height: "600px", position: "relative", width: "80%" }}>
                            <FlowingMenu items={demoItems} />
                        </div>
                    </div>
                </div>
            </div>


            <div className="magic-bento-container">
                <MagicBento />
            </div>


            <div className="texttype-section">
                <TextType
                    text={["Projects I've worked on", "Things I've messed around with", "What I'm currently working on"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                />
            </div>


            <div style={{ height: '600px', position: 'relative' }}>
                <ChromaGrid
                    items={items}
                    radius={300}
                    damping={0.45}
                    fadeOut={0.6}
                    ease="power3.out"
                />
            </div>




        </main>
    );
}

export default App;
