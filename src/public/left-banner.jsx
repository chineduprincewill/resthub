import React from 'react'
import { Badge } from '../components/ui/badge'

const LeftBanner = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className="space-y-4 px-4 py-4 lg:px-20 z-20">
                <img src='/assets/coa.png' alt='banner' width="120px" />
                <div className='w-full'>
                    <h1 className="text-4xl md:text-8xl font-semibold leading-tight mt-[-30px]">RestHub II</h1>
                </div>
                <p className="gradient-title text-2xl md:text-4xl">Database</p>
                <p className="text-foreground/70 dark:text-muted-foreground text-lg md:text-xl max-w-md">
                Collaborative project on HIV-Tuberculosis genomic sequencing and characterization reporting.
                </p>
                <Badge 
                    variant="outline" 
                    className="bg-accent/20 border-accent px-4 py-2 text-accent text-sm font-bold"
                >
                    Genomic sequencing reporting automated
                </Badge>
            </div>
            <div className='w-full hidden md:block md:w-1/2 fixed top-0 h-screen m-0 bg-[url("/assets/reshub.png")] bg-contain opacity-20'></div>
        </div>
    )
}

export default LeftBanner