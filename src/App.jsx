import Aurora from "./Aurora.jsx";
import GlassNav from "./GlassNav.jsx";
import RotatingText from "./rotatingText.jsx";
import Plasma from "./Plasma";

function App() {
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

            {/* Centered hero card */}
            <div className="hero-center">
                <div className="hero-card">
                    {/* Plasma background filling the card */}
                    <div className="hero-plasma-bg">
                        <Plasma
                            color="#ff6b35"
                            speed={0.6}
                            direction="forward"
                            scale={1.1}
                            opacity={0.8}
                            mouseInteractive={true}
                        />
                    </div>

                    {/* Foreground content */}
                    <div className="hero-role">
                        <span className="hero-prefix">I am a</span>

                        <button type="button" className="btn btn-primary rotating-btn">
                            <span className="rotating-text-wrapper">
                                <RotatingText
                                    texts={["Web Developer", "Software Developer", "Backend Developer"]}
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
                </div>
            </div>
        </main>
    );
}

export default App;
