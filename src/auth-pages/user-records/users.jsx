import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { fetchUsers, updateStatus } from '../../utils/users'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { CircleCheck, CircleX, Edit } from 'lucide-react'
import SkeletonComponent from '../../components/skeleton-component'
import DataTable from '../../components/data-table'
import StatusOptions from './status-options'
import UpdateUser from './update-user'
import { toast } from 'sonner'

const Users = () => { 

    const { token, record, refreshRecord } = useContext(AppContext)
    const [users, setUsers] = useState()
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [user_id, setUser_id] = useState();
    const [filter, setFilter] = useState();
    const [success, setSuccess] = useState()

    const columns = [
        {
            accessorKey: 'name',
            header: 'Full name',
            cell: ({row}) => {
                const usr = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="text-muted-foreground font-extralight">{usr.name}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({row}) => {
                const usr = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="font-extralight">{usr.email}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'orgnization',
            header: 'Organization',
            cell: ({row}) => {
                const usr = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="text-muted-foreground font-extralight text-wrap">{usr.organization !== null && usr.organization+', '+usr.state}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'organization_category',
            header: 'Privilege',
            cell: ({row}) => {
                const usr = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="text-muted-foreground font-extralight">{usr.organization_category !== null && usr.organization_category}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
            const usr = row.original; 
            return (
                <div className="flex justify-end items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Edit account</DialogTitle>
                            <UpdateUser usr={usr} />
                        </DialogContent>
                    </Dialog>
                    <div className='flex items-center p-0.5 gap-1 rounded-full border border-muted-foreground/40 bg-muted-foreground/10'>
                        <CircleCheck 
                            className={`!w-4 !h-4 ${usr.status === 1 ? 'text-green-600' : 'text-muted-foreground/20 cursor-pointer hover:text-green-400'} ${updating && usr.id === user_id && 'animate-spin text-green-600'}`} 
                            onClick={() => usr.status === 0 && updateUserStatus(usr, 'activate')}
                        />
                        <CircleX 
                            className={`!w-4 !h-4 ${usr.status === 0 ? 'text-red-600' : 'text-muted-foreground/20 cursor-pointer hover:text-red-400'} ${updating && usr.id === user_id && 'animate-spin text-red-600'}`} 
                            onClick={() =>  usr.status === 1 && updateUserStatus(usr, 'disable')}
                        />
                    </div>
                </div>
            );
            },
        },
    ];

    const datafilters = [
        {
            title: "name",
            placeholder: "filter by name..."
        },
        {
            title: "email",
            placeholder: "filter by email..."
        },
        {
            title: "organization",
            placeholder: "filter by organization..."
        },
        {
            title: "organization_category",
            placeholder: "filter by role..."
        },
    ]

    const userFilter = useMemo(() => {
        let filtered = users && users;

        if(filter){
            filtered = users && users.filter(usr => usr.status === parseInt(filter))
        }

        return filtered
    }, [filter, users])

    const updateUserStatus = (usr, action) => {

        setUser_id(usr.id)
        if(window.confirm(`Are you sure you want to ${action} ${usr.name} access?`)){

            if(usr.status === 0 && (!usr.organization || !usr.organization_category)) {
                alert('Account must be assigned an Organization and Privilege before activation');
                return;
            }

            const data = {
                id:usr.id,
                action
            }

            updateStatus(token, data, setSuccess, setError, setUpdating)
        }
    }   
    
    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        fetchUsers(token, setUsers, setError, setIsLoading)
    }, [record])

    return (
        <div className='w-full grid gap-4 p-4'>
            <div className='w-full flex items-center gap-4 text-sm'>
                <div className='max-w-max flex items-center gap-4 px-4 py-2 rounded-full bg-background'>
                    <StatusOptions setFilter={setFilter} filter={filter} />
                {
                    filter &&
                    <CircleX 
                        className='!w-4 !h-4 cursor-pointer text-red-500 hover:text-red-700' 
                        onClick={() => setFilter()}
                    />
                }
                </div>
            </div>
            <div className='w-full p-4 bg-background overflow-x-scroll rounded-t-2xl'>
            {
                isLoading ? <SkeletonComponent /> :
                userFilter &&
                <DataTable data={userFilter} columns={columns} filterArrs={datafilters} />
            }
            </div>
        </div>
    )
}

export default Users