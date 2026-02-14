import { motion } from "framer-motion";

export default function TextGenerateEffect({
    text,
    className = "",
    staggerDelay = 0.08,
    wordDuration = 0.4,
    startDelay = 0
}) {
    const words = text.split(" ");

    return (
        <span className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{
                        duration: wordDuration,
                        delay: startDelay + i * staggerDelay,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="inline-block"
                >
                    {word}
                    {i < words.length - 1 && "\u00A0"}
                </motion.span>
            ))}
        </span>
    );
}
