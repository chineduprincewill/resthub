import React, { useContext, useEffect, useState } from 'react';
import DataTable from '@/components/data-table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Check, CheckCircle2Icon, CircleCheck, CircleX, Copy, Edit, KeyRound, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import SkeletonComponent from '../../components/skeleton-component';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { toast } from 'sonner';
import { fetchFormfields, updateStatus } from '../../utils/resthubfunction';
import { DialogContent, DialogTitle } from '../../components/ui/dialog';
import NewFormField from './new-form-field';
import { id } from 'date-fns/locale';

const FormFields = ({ forms_title }) => {

    const { token, record, refreshRecord } = useContext(AppContext);
    const [formfields, setFormfields] = useState();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [updating, setUpdating] = useState(false);
    const [field_id, setField_id] = useState();
    const [action, setAction] = useState();
    
    const columns = [
        {
            accessorKey: 'forms_text_id',
            header: 'Field order',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="text-muted-foreground font-extralight">{field.forms_text_id}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'forms_text',
            header: 'Field',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="text-muted-foreground font-extralight text-xs">{field.forms_sub_title}</span>
                        <span className="font-extralight">{field.forms_text}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'forms_type',
            header: 'Field type',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='grid gap-0'>
                        <span className="text-muted-foreground font-extralight">{field.forms_type}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'field_trigger',
            header: 'Field trigger',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='grid gap-0'>
                    {
                        field.field_trigger &&
                        <span className="text-muted-foreground font-extralight text-wrap"> Show, if {field.field_trigger} contains {field.trigger_value}</span>
                    }
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'control',
            header: 'Required',
            cell: ({row}) => {
                const field = row.original;
                return(
                    field.control === 1 ?
                    <Check className='w-4 h-4 text-green-600' /> :
                    <X className='w-4 h-4 text-muted-foreground/20' />
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
            const form = row.original; 
            return (
                <div className="flex justify-end items-center gap-3">
                {
                    form.status === 1 &&
                    <>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Edit field</DialogTitle>
                            <NewFormField forms_title={forms_title} formdata={form} action='edit' />
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Copy 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Copy field</DialogTitle>
                            <NewFormField forms_title={forms_title} formdata={form} action='copy' />
                        </DialogContent>
                    </Dialog>
                    </>
                }
                    <div className='flex items-center p-0.5 gap-1 rounded-full border border-muted-foreground/40 bg-muted-foreground/10'>
                        <CircleCheck 
                            className={`!w-4 !h-4 ${form.status === 1 ? 'text-green-600' : 'text-muted-foreground/20 cursor-pointer hover:text-green-400'} ${updating && form.id === field_id && action === 'activate' && 'animate-spin text-green-600'}`} 
                            onClick={() => form.status === 0 && activateField(form.id, form.forms_text, 'activate')}
                        />
                        <CircleX 
                            className={`!w-4 !h-4 ${form.status === 0 ? 'text-red-600' : 'text-muted-foreground/20 cursor-pointer hover:text-red-400'} ${updating && form.id === field_id && action === 'disable' && 'animate-spin text-red-600'}`} 
                            onClick={() =>  form.status === 1 && disableField(form.id, form.forms_text, 'disable')}
                        />
                    </div>
                </div>
            );
            },
        },
    ];

    const datafilters = [
        {
            title: "forms_text",
            placeholder: "filter by field..."
        },
    ]

    const activateField = (fldid, fieldname) => {
        if(window.confirm(`Are you sure you want to activate ${fieldname} field?`)){
            setAction('activate')
            setField_id(fldid)
            const data = {
                id:fldid,
                action:'activate'
            }

            updateStatus(token, data, setSuccess, setError, setUpdating)
        }
    }

    const disableField = (fldid, fieldname) => {
        if(window.confirm(`Are you sure you want to disable ${fieldname} field?`)){
            setAction('disable')
            setField_id(fldid)
            const data = {
                id:fldid,
                action:'disable'
            }

            updateStatus(token, data, setSuccess, setError, setUpdating)
        }
    }

    if(success){
            toast.success("Field updated successfully!", {
                className: "!bg-green-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-green-700",
            });
            refreshRecord(Date.now());
            setSuccess();
            setAction()
            setField_id()
    }

    if(error){
        alert(JSON.stringify(error))
    }

    useEffect(() => {
        fetchFormfields(token, { forms_title }, setFormfields, setError, setLoading);
    }, [forms_title, record])

    useEffect(() => {
        updating && setTimeout(() => setUpdating(false), 1000)
    }, [field_id, updating])
    
    return (
        <div className='w-full grid gap-4'>
            <div className='w-full px-4 overflow-x-scroll'>
            {
                loading ? <SkeletonComponent /> :
                formfields &&
                <DataTable data={formfields} columns={columns} filterArrs={datafilters} />
            }
            </div>
        </div>
    )
}

export default FormFields