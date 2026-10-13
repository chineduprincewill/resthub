import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import React from 'react'

const ManageColumns = ({ headers = [], excluded = [], setExcluded }) => {

    const colsarray = headers.filter(col => !excluded.includes(col));

    const excludeColumn = (col) => {
        setExcluded(prev => prev.includes(col) ? prev : [...prev, col]);
    };

    const activateColumn = (col) => {
        setExcluded(prev => prev.filter(h => h !== col));
    };

    return (
        <div className='grid gap-2'>
            <div className='w-full flex items-start gap-0'>
                <div className='w-3/5 grid gap-2 p-2'>
                    <h1 className='font-extralight text-lg'>Active columns</h1>
                    <div className='w-full p-2 border border-muted-foreground/20 rounded-xl flex flex-wrap gap-4'>
                        {colsarray.map((hd, index) => (
                            <div key={index} className='flex items-center gap-1 text-sm text-muted-foreground cursor-pointer'>
                                <CircleArrowRight
                                    className='w-3 h-3 text-red-600 hover:text-red-800'
                                    onClick={() => excludeColumn(hd)}
                                />
                                <span className='hover:text-foreground'>{hd}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-2/5 grid gap-2 p-2'>
                    <h1 className='font-extralight text-lg'>Excluded columns</h1>
                    <div className='w-full p-2 border border-muted-foreground/20 rounded-xl flex flex-wrap gap-4'>
                        {excluded.map((hd, index) => (
                            <div key={index} className='flex items-center gap-1 text-sm text-muted-foreground cursor-pointer'>
                                <CircleArrowLeft
                                    className='w-3 h-3 text-green-600 hover:text-green-800'
                                    onClick={() => activateColumn(hd)}
                                />
                                <span className='hover:text-foreground'>{hd}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageColumns