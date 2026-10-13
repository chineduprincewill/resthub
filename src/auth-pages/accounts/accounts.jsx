import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Edit, FilePlusCorner } from 'lucide-react';
import DataTable from '../../components/data-table';
import SkeletonComponent from '../../components/skeleton-component';
import { fetchRoles } from '../../utils/roles';
import EditAccount from './edit-account';
import UserAssignForm from './user-assign-form';

const Accounts = () => {

    const { token, user, record } = useContext(AppContext);
    const [roles, setRoles] = useState()
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState()

    const columns = [
        {
            id: 'actions',
            cell: ({ row }) => {
              const acct = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <EditAccount acct={acct} />
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <FilePlusCorner 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <UserAssignForm usr={acct} />
                    </Dialog>
                </div>
              );
            },
        },
        {
            accessorKey: 'fullname',
            header: 'Full name',
            enableSorting: true,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const acct = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div className="w-full flex items-center gap-0">
                        <div 
                            className={`max-w-max rounded-l-full px-2 pb-1 text-sm ${acct?.role === 'user' ? 'bg-accent' : 'bg-foreground/20 hover:bg-foreground/40 cursor-pointer'}`}
                            onClick={() => acct?.role !== 'user' && updateRole(acct)}
                        >
                            user
                        </div>
                        <div 
                            className={`max-w-max rounded-r-full px-2 pb-1 text-sm ${acct?.role === 'admin' ? 'bg-accent' : 'bg-foreground/20 hover:bg-foreground/40 cursor-pointer'}`}
                            onClick={() => acct?.role !== 'admin' && updateRole(acct)}
                        >
                            admin
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'directorate',
            header: 'Directorate',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'unit',
            header: 'Unit',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'office',
            header: 'Office location',
            enableSorting: true,
            enableColumnFilter: true,
        },
    ];

    const datafilters = [
        {
            title: "fullname",
            placeholder: "filter by name..."
        },
        {
            title: "email",
            placeholder: "filter by email..."
        },
        {
            title: "role",
            placeholder: "filter by role..."
        },
        /**{
            title: "directorate",
            placeholder: "filter by directorate..."
        },
        {
            title: "unit",
            placeholder: "filter by unit..."
        }*/
    ]

    const updateRole = (acc) => {
        let updaterole = acc?.role === 'admin' ? 'user' : 'admin';
        if(window.confirm(`Are you sure you want to switch ${acc?.fullname} role from ${acc?.role} to ${updaterole}`)){
            alert('Role updated!')
        }
    }

    useEffect(() => {
        fetchRoles(token, setRoles, setError, setLoading)
    }, [record])

    console.log(roles);

    return (
        <div className='w-full p-4 space-y-8'>
            <div className='w-full flex justify-between items-center'>
                <span className='text-xl font-extralight'>Accounts</span>
            </div>
            <div className='w-full'>
            {
                loading || !roles ? <SkeletonComponent /> :
                <DataTable data={roles} columns={columns} filterArrs={datafilters} />
            }  
            </div>
        </div>
    )
}

export default Accounts