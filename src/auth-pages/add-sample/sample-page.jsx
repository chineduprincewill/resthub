import React, { useContext, useEffect, useState } from 'react'
import AddSamplePage from './add-sample-page';
import { Button } from '../../components/ui/button';
import { CircleX, Columns3, Plus } from 'lucide-react';
import SampleLog from './sample-log';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { fetchAddSampleColumns } from '../../utils/resthubfunction';
import { AppContext } from '../../context/AppContext';
import SkeletonComponent from '../../components/skeleton-component';
import ManageColumns from './manage-columns';
import FilterOptions from '../../components/filter-options';

const SamplePage = () => {

    const { token, user } = useContext(AppContext)
    const [headers, setHeaders] = useState()
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [active, setActive] = useState('log');
    const [excluded, setExcluded] = useState([
        "pDST result", "gDST (LPA) result", "gDST (Xpert) result", "gDNA Quality (260/230nm)|Mechanical", "gDNA Extraction/Inactivation Method", "gDNA Quality (260/280nm)|Mechanical", "Repeat gDNA Quality(260/280nm)", "gDNA Quantity(ng/ul)|Mechanical", "gDNA Quality (260/280nm)|Genolyse", "gDNA Quality (260/230nm)|Genolyse", "Repeat gDNA Quantity(ng/ul)", "gDNA Extract Volume (uL)|Genolyse", "gDNA Quantity(ng/ul)|Genolyse", "gDNA Extract Volume (uL)|Mechanical", "gDNA Quantity | Qubit-Mechanical", "gDNA Quantity | Qubit-Genolyse"
    ])
    const [editrecord, setEditrecord] = useState();
    const [step, setStep] = useState();
    const [filter, setFilter] = useState(user && JSON.parse(user).organization_category === 'NRL' && 'Awaiting sample receipt')

    const formtitle = user && JSON.parse(user).organization_category === 'NTRL' ? 'Add Sample' : 'Receive Sample';

    const returnToLog = () => {
        setActive('log')
        setEditrecord();
    }

    useEffect(() => {
        fetchAddSampleColumns(token, setHeaders, setError, setIsLoading)
    }, [])

    return (
        <div className='w-full grid gap-0'>
            <div className={`'w-full flex ${active === 'log' ? 'justify-between' : 'justify-end'} items-center p-4`}>
            {
                active === 'log' &&
                <div className='flex items-center gap-8'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='p-2 rounded-full bg-accent hover:bg-accent/80'>
                                <Columns3 className='w-5 h-5 cursor-pointer text-white' />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="!w-[85vw] min-h-48 flex flex-col items-start overflow-y-scroll !max-w-none">
                            <ManageColumns 
                                headers={headers} 
                                excluded={excluded} 
                                setExcluded={setExcluded} 
                            />
                        </DialogContent>
                    </Dialog>
                    <div className='flex items-center gap-4'>
                    {
                        //user && (JSON.parse(user).organization_category === 'NTRL' || JSON.parse(user).organization_category === 'NRL') && 
                        <FilterOptions setFilter={setFilter} filter={filter} />
                    }
                    {
                        filter && filter !== '' && user && JSON.parse(user).organization_category !== 'NRL' &&
                        <CircleX 
                            className='!w-4 !h-4 cursor-pointer text-red-500 hover:text-red-700' 
                            onClick={() => setFilter('')}
                        />
                    }
                    </div>
                </div>
            } 
            {
                user && JSON.parse(user).organization_category === 'NTRL' && active === 'log' ?
                <Button 
                    variant="outline" 
                    className="rounded-full w-1/8 bg-accent hover:bg-accent/80 text-white shadow-xl"
                    onClick={() => setActive('add')}
                >
                    <div className='flex items-center justify-center gap-1'>
                        <Plus className='!w-6 !h-6' />
                        <span>Sample</span>
                    </div>
                </Button>
                :
                <Button 
                    variant="outline" 
                    className="rounded-full w-1/8 bg-accent hover:bg-accent/80  text-white shadow-xl"
                    onClick={() => returnToLog()}
                >
                    Sample log
                </Button>
            }
            </div>
        {
            isLoading ? <SkeletonComponent /> :
            (active === 'log' ?
            <div className='w-full px-4 overflow-hidden'>
                <SampleLog 
                    headers={headers} 
                    excluded={excluded} 
                    setActive={setActive}
                    setEditrecord={setEditrecord}
                    setStep={setStep}
                    filter={filter}
                />
            </div> :
            <AddSamplePage 
                setActive={setActive} 
                editrecord={editrecord} 
                setEditrecord={setEditrecord} 
                fmtitle={formtitle}
                step={step}
            />)
        }
        </div>
    )
}

export default SamplePage