import React from 'react'

const PopulationReportTabs = ({ currentStatus, setCurrentStatus }) => {
    return (
        <div className='w-full grid pb-4 bg-background rounded-2xl'>
            <div className='w-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-background dark:from-accent/30 dark:to-background gap-0 rounded-t-2xl font-extralight'>
                <div className={`md:max-w-max flex justify-center items-center px-6 py-2 border-r border-muted-foreground/20 capitalize gap-2 cursor-pointer hover:bg-background ${currentStatus === 'Geopolitical Zone' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('Geopolitical Zone')}>
                    <span>Geopolitical Zone</span>
                </div>
                <div className={`md:max-w-max flex justify-center items-center px-6 py-2 capitalize border-r border-muted-foreground/20 gap-2 cursor-pointer hover:bg-background ${currentStatus === 'State' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('State')}>
                    <span>State</span>
                </div>
                <div className={`md:max-w-max flex justify-center items-center px-6 py-2 border-muted-foreground/20 capitalize border-r gap-2 cursor-pointer hover:bg-background ${currentStatus === 'HIV Status' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('HIV Status')}
                >
                    <span>HIV Status</span>
                </div>
                <div className={`md:max-w-max flex justify-center items-center px-6 py-2 border-muted-foreground/20 capitalize border-r gap-2 cursor-pointer hover:bg-background ${currentStatus === 'Sex' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('Sex')}
                >
                    <span>Sex</span>
                </div>
                <div className={`md:max-w-max flex justify-center items-center px-6 py-2 border-muted-foreground/20 capitalize gap-2 cursor-pointer hover:bg-background ${currentStatus === 'Age' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('Age')}
                >
                    <span>Age</span>
                </div>
            </div>
        </div>
    )
}

export default PopulationReportTabs