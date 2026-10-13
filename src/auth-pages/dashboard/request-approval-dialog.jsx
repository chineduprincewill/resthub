import React, { useContext, useState } from 'react'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'
import { changeRequestApproval } from '../../utils/resthubfunction'
import { toast } from 'sonner'

const RequestApprovalDialog = ({ req, approval_status }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [success, setSuccess] = useState()
    const [error, setError] = useState()
    const [submitting, setSubmitting] = useState(false)
    const [remark, setRemark] = useState(approval_status === 'Approve' ? 'Approved!' : '')

    const handleSubmit = (e) => {
        e.preventDefault()

        if(window.confirm(`Confirm that you want to ${approval_status} this request`)){
            const data = {
                id:req.id,
                form_id:req.request_id,
                request_on:req.request_on,
                remark,
                approval_status
            }
    
            changeRequestApproval(token, data, setSuccess, setError, setSubmitting)
        }
    }

    if(success){
        toast.success('Request status successfully updated!', {
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
            <div className='p-2 text-muted-foreground rounded-md border border-muted-foreground/20'>
            {
                req.request
            }
            </div>
            <span className='font-extralight text-sm text-muted-foreground'>From {req.sender}</span>
            <Textarea 
                value={remark}
                rows="4"
                placeholder={`Enter reason for ${approval_status}`}
                onChange={(e) => setRemark(e.target.value)}
            />
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

export default RequestApprovalDialog