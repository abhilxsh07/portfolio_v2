import { IconArrowRight } from "@tabler/icons-react";
import "./CursusOverview.css";

// Not a screenshot. The real UI used a design system that isn't mine, so this
// is a drawing of the pipeline instead.
const bars = [36, 68, 48, 86, 58, 74, 40, 92, 52, 66, 44, 80];

export default function CursusOverview({ note }) {
    return (
        <figure className="cursus-overview">
            <figcaption className="cursus-overview-eyebrow">Cursus · illustration, not an app screenshot</figcaption>
            <div className="cursus-overview-document">
                <span className="cursus-overview-type">PDF</span>
                <div>
                    Your course material<small>Private upload · owned by one user</small>
                </div>
            </div>
            <div className="cursus-overview-route" aria-hidden="true">
                <span />
                <IconArrowRight size={18} />
                <span />
            </div>
            <div className="cursus-overview-engine">
                <span className="cursus-overview-eyebrow">Convert → chunk → embed</span>
                <p>Notes become searchable.</p>
                <div className="cursus-vector-bars" aria-hidden="true">
                    {bars.map((height, index) => (
                        <i key={index} style={{ height: `${height}%` }} />
                    ))}
                </div>
            </div>
            <div className="cursus-overview-outputs">
                <span>Grounded chat</span>
                <span>Summaries</span>
                <span>Quizzes</span>
            </div>
            {note && <p className="cursus-overview-note">{note}</p>}
        </figure>
    );
}
