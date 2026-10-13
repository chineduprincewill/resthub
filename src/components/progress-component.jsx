import React, { useEffect, useState } from 'react'
import { Progress } from './ui/progress';

const ProgressComponent = () => {

    const [progress, setProgress] = useState();

    useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 50)
        return () => clearTimeout(timer)
    }, [])

    return (
        <Progress value={progress} className="w-full mt-24" />
    )
}

export default ProgressComponent