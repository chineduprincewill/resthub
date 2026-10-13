import React, { useContext, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'
import { toast } from 'sonner'
import { createRequest } from '../../utils/resthubfunction'
import { formatRequestsReason } from '../../utils/functions'

const ChangeRequest = ({ record, request_on }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [reason, setReason] = useState();
    const [success, setSuccess] = useState()
    const [error, setError] = useState()
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            id: record['form_id'],
            reason: formatRequestsReason(request_on) + record['Sample ID']+'. '+reason,
            request_on
        }

        if(window.confirm('Click OK if you are confirming your reason for the request')){
            createRequest(token, data, setSuccess, setError, setSubmitting)
        }
    }

    if(success){
        toast.success('Request to revert shipping submitted successfully! Check your dashboard', {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now())
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className='grid gap-2'>
                <Label className="text-sm font-extralight">
                    Provide reason for reverting the shipment of Sample - {record['Sample ID']}
                </Label>
                <Textarea 
                    className="p-2 rounded-md"
                    rows="4"
                    placeholder="Type here..."
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
            </div>
            <Button 
                variant="outline"
                disabled={submitting}
            >
                {submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                    </span>
                    ) : (
                    "Submit"
                )}
            </Button>
        </form>
    )
}

export default ChangeRequest