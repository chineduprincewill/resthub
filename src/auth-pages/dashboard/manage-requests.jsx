import React, { useContext, useEffect, useMemo, useState } from 'react'
import RequestFilterOptions from './request-filter-options'
import { AppContext } from '../../context/AppContext';
import { closeRequest, receivedRequests, sentRequests } from '../../utils/resthubfunction';
import { format } from 'date-fns';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { statusColor } from '../../utils/functions';
import { CircleCheck, CircleX, MessageCircle, MessageSquareText } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import RequestApprovalDialog from './request-approval-dialog';
import { toast } from 'sonner';

const ManageRequests = () => {

    const { token, user, record, refreshRecord } = useContext(AppContext)
    const [filter, setFilter] = useState("");
    const [requests, setRequests] = useState()
    const userinfo = user && JSON.parse(user)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState();
    const [isClosing, setIsClosing] = useState(false)
    const [item_to_close, setItem_to_close] = useState()

    const columns = [
        {
            accessorKey: 'request',
            header: 'Request',
            cell: ({row}) => {
                const reqs = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="font-extralight text-wrap">{reqs.request}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'sender',
            header: 'From',
            cell: ({row}) => {
                const reqs = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="font-extralight">{reqs.sender}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({row}) => {
                const reqs = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className={`font-extralight ${statusColor(reqs.status)}`}>{reqs.status}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({row}) => {
                const reqs = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="font-extralight">{format(reqs.created_at, "PPP")}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
            const reqs = row.original; 
            return (
                <div className="flex justify-end items-center gap-2">
                {
                    reqs.remark && 
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='p-1 rounded-full hover:bg-foreground/10 cursor-pointer'>
                                <MessageSquareText className='!w-4 !h-4 text-blue-600' />
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="font-extralight text-sm">{reqs.remark}</DialogTitle>
                        </DialogContent>
                    </Dialog>
                }
                {
                    userinfo.organization_category === 'Admin' && reqs.status === 'pending...' &&
                    <>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className='p-1 rounded-full hover:bg-foreground/10 cursor-pointer'>
                                    <CircleCheck className='!w-4 !h-4 text-green-600' />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle className="font-extralight">Approve request</DialogTitle>
                                <RequestApprovalDialog req={reqs} approval_status={'Approve'} />
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className='p-1 rounded-full hover:bg-foreground/10 cursor-pointer'>
                                    <CircleX className='!w-4 !h-4 text-red-600' />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle className="font-extralight">Decline request</DialogTitle>
                                <RequestApprovalDialog req={reqs} approval_status={'Decline'} />
                            </DialogContent>
                        </Dialog>
                    </>
                }
                {
                    userinfo.email === reqs.sender && reqs.status !== 'pending...' &&
                    <CircleX 
                        className={`!w-4 !h-4 cursor-pointer text-red-500 hover:text-red-700 ${reqs.id === item_to_close && 'animate-spin'}`}
                        onClick={() => closeChangeRequest(reqs.id)}
                    />
                    
                }
                </div>
            );
            },
        },
    ];

    const datafilters = [
        {
            title: "request",
            placeholder: "filter request (eg. by sample ID) ..."
        },
    ]

    const closeChangeRequest = (reqid) => {
        setItem_to_close(reqid)
        if(window.confirm("Are you sure you want to close this request? You won't be able to view it again.")){
            const data = {
                id:reqid
            }

            closeRequest(token, data, setSuccess, setError, setIsClosing)
        }
    }

    const requestFilter = useMemo(() => {
        let filtered = requests && requests;

        if(filter){
            filtered = requests && requests.filter(req => req.status === filter)
        }

        return filtered

    }, [filter, requests])

    if(success){
        toast.success('Request successfully closed!', {
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

    useEffect(() => {   
        userinfo.organization_category === 'Admin' ?
        receivedRequests(token, setRequests, setError, setIsLoading) :
        sentRequests(token, setRequests, setError, setIsLoading)
    }, [record])

    console.log(requests && requests)

    return (
        <div className='w-full grid gap-4'>
            <RequestFilterOptions setFilter={setFilter} filter={filter} />
            <div className='w-full px-4 overflow-x-scroll'>
            {
                isLoading ? <SkeletonComponent /> :
                requestFilter &&
                <DataTable data={requestFilter} columns={columns} filterArrs={datafilters} />
            }
            </div>
        </div>
    )
}

export default ManageRequests