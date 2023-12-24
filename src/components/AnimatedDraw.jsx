import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const getRandomItemOfArray = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const AnimatedDraw = ({ participants, onSelected }) => {
    const [index, setIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    const initialDelay = 100;
    const maxDelay = 1000;
    const incrementDelay = 35;

    useEffect(() => {
        if (participants.length) {
            setIndex(0);
            setIsAnimating(true);
            let currentDelay = initialDelay;

            const interval = setInterval(() => {
                setIndex(prevIndex => (prevIndex + 1) % participants.length);
                currentDelay = Math.min(currentDelay + incrementDelay, maxDelay);

                if (currentDelay === maxDelay) {
                    clearInterval(interval);
                    setIsAnimating(false);

                    const selectedParticipant = participants[index];
                    if (selectedParticipant === undefined) {
                        onSelected(getRandomItemOfArray(participants));
                        return;
                    }

                    onSelected(participants[index]);
                }
            }, currentDelay);

            return () => clearInterval(interval);
        }
    }, [participants]);

    const props = useSpring({
        to: { opacity: 1 },
        from: { opacity: 0 },
        reset: isAnimating,
        immediate: !isAnimating
    });

    return (
        <animated.div style={props}>
            {participants.length > 0 ? participants[index] : "Repita el sorteo"}
        </animated.div>
    );
};

export default AnimatedDraw;
