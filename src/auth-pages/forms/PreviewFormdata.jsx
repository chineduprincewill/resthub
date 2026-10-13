import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { format } from 'date-fns'
import { isDate } from '../../utils/functions'

const PreviewFormdata = ({ formdata }) => {
    console.log(formdata)
    
    return (
        <DialogContent className="w-[98vw] max-h-[96vh] overflow-y-auto !max-w-none">
            <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
                <DialogDescription>
                Confirm <span className='font-bold'> form information</span>. Click outside to close when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <div className='w-full md:flex md:flex-wrap md:items-center'>
            {
                formdata && Object.entries(formdata).map(([key, value], index) => (
                    <div 
                        key={key || index}  // ✅ Add unique key
                        className='w-full md:w-[32%] grid gap-0 px-2 py-2 border-b border-muted-foreground/10 hover:bg-muted-foreground/10'  // ✅ Use visible border color
                    >
                        <span className='w-full capitalize text-muted-foreground text-xs'>
                            {key?.replaceAll('_', ' ') || ''}
                        </span>
                        <span className='w-full font-semibold text-sm'>
                            {isDate(value)
                                ? format(value, "PPP")
                                : typeof value === 'object' && value !== null
                                    ? JSON.stringify(value)
                                    : String(value)
                            }
                        </span>
                    </div>
                ))
            }
            </div>
        </DialogContent>
    )
}

export default PreviewFormdata