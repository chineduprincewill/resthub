import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Group, ListCheck, TrainTrack, User, Users } from 'lucide-react';
import IndividualReport from './individual-report';
import PopulationReport from './population-report';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AppContext } from '../../context/AppContext';
import { dashboardStatistics } from '../../utils/resthubfunction';
import ManageRequests from './manage-requests';

const Dashboard = () => {

    const { token } = useContext(AppContext)
    const [statistics, setStatistics] = useState([])
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        dashboardStatistics(token, setStatistics, setError, setIsLoading)
        
        const intervalId = setInterval(() => {
            dashboardStatistics(token, setStatistics, setError, setIsLoading)
        }, 60000); // 60 seconds
        
        return () => clearInterval(intervalId);
    }, [])
  
    return (
        <div className="p-4 grid gap-4">
            <div className="bg-background border border-border rounded-lg p-6">
                <div className={`grid md:grid-cols-3 gap-4`}>
                {
                    <div
                        className="bg-gray-100 dark:bg-accent/10 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                    >
                        <div>
                            <p className="text-lg font-extralight text-foreground">Pending Requests</p>
                            <p className="text-xs text-muted-foreground hover:text-foreground mt-1 cursor-pointer">
                            <Dialog>
                                <DialogTrigger>
                                    <span>Click here to view requests</span>
                                </DialogTrigger>
                                <DialogContent className="!w-[98vw] !h-[97vh] flex flex-col items-start overflow-y-scroll !max-w-none">
                                    <DialogTitle className="font-extralight">Change Requests</DialogTitle>
                                    <ManageRequests />
                                </DialogContent>
                            </Dialog>
                            </p>
                        </div>
                        <div 
                            className={`w-10 h-10 ${statistics > 0 ? 'bg-accent text-white' : 'bg-muted-foreground/20'} rounded-lg flex items-center justify-center cursor-pointer text-3xl`}
                        >
                            <span>{statistics}</span>
                        </div>
                    </div>
                }
                    <div
                        className="bg-gray-100 dark:bg-accent/10 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                    >
                        <div>
                            <p className="text-lg font-extralight text-foreground">Pending Receipt</p>
                            <p className="text-xs text-muted-foreground hover:text-foreground mt-1 cursor-pointer">
                                <span className='cursor-pointer hover:text-accent'>Number of samples awaiting receipt</span>
                            </p>
                        </div>
                        <div className='p-2 bg-foreground/10 rounded-md'>
                            <TrainTrack className='w-6 h-6 text-accent' />
                        </div>
                    </div>
                {
                    <div
                        className="bg-gray-100 dark:bg-accent/10 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                    >
                        <div>
                            <p className="text-lg font-extralight text-foreground">Awaiting Result</p>
                            <p className="text-xs text-muted-foreground hover:text-foreground mt-1 cursor-pointer">
                            <span className='cursor-pointer hover:text-accent'>Number of samples awaiting result entry</span>
                            </p>
                        </div>
                        <div className={`p-2 rounded-md ${statistics && statistics.checklist_count && statistics.checklist_count > 0 ? 'border-2 border-red-600 bg-red-600/20' : 'bg-foreground/10'} cursor-pointer`}>
                            <ListCheck className='w-6 h-6 text-accent' />
                        </div>
                    </div>
                }
                </div>
            </div>
            <Tabs defaultValue="individual" className='grid gap-2'>
                <TabsList className="gap-4 w-full md:max-w-max">
                    <TabsTrigger value="individual">
                        <div className='flex gap-1 items-center'>
                            <User size={16} />
                            <span className='hidden md:block'>Individual</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="population">
                        <div className='flex gap-1 items-center'>
                            <Users size={16} />
                            <span className='hidden md:block'>Population</span>
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="individual">
                    <IndividualReport />
                </TabsContent>
                <TabsContent value="population">
                    <PopulationReport />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Dashboard