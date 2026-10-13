import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { fetchOrgAddSampleRecords, shipSample } from '../../utils/resthubfunction';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { CircleCheckBig, Edit, Eye, FileSpreadsheet, HandIcon, PencilLine, Search, Ship, Truck, Undo2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { generateKeyValuePdf } from '../../utils/generateKeyValuePdf';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import ChangeRequest from './change-request';

const SampleLog = ({ headers, excluded, setActive, setEditrecord, setStep, filter }) => {

    const { token, user , record, refreshRecord } = useContext(AppContext)
    //const [headers, setHeaders] = useState()
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [columns, setColumns] = useState([])
    const [records, setRecords] = useState();
    const [sample_to_ship, setSample_to_ship] = useState();
    const [success, setSuccess] = useState();
    const [shipping, setShipping] = useState(false);
    const [search, setSearch] = useState("")

    const recordFilter = useMemo(() => {
        let filtered = records && records;

        if(user && JSON.parse(user).organization_category === 'NRL' && filter){
            if(filter === 'Awaiting result entry'){
                filtered = records && records.filter(record => record && 'gDNA Extract Receipt Date' in record)
            }
            else {
                filtered = records && records.filter(record => record && 'Shipment Date' in record)
            }
        }

        if(user && JSON.parse(user).organization_category === 'NTRL' && filter){
            if(filter === 'Awaiting sample shipment'){
                filtered = records && records.filter(record => record && !('Shipment Date' in record));
            }
        }

        if(search && search !== ""){
            filtered = records && records.filter(record => JSON.stringify(record).toLowerCase().includes(search.toLowerCase()))
        }

        return filtered
    }, [filter, search, records])

    const editFormRecord = (rcd) => {
        setStep()
        setEditrecord(rcd)
        setActive('add')
    }

    const enterResult = (rcd, stp) => {
        setStep(stp)
        setEditrecord(rcd)
        setActive('add')
    }

    const handleSampleShipping = (editrecord) => {
        setSample_to_ship(editrecord)
        if(window.confirm(`Are you sure you want to ship this sample with ID : ${editrecord["Sample ID"]}?`)){
            shipSample(token, { form_id: editrecord.form_id }, setSuccess, setError, setShipping);
        }
    };

    if(success){
        toast.success('Sample successfully shipped!', {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        generateKeyValuePdf(sample_to_ship, {
            title: 'Sample',
            subtitle: `Form ID: ${sample_to_ship.form_id} • ${sample_to_ship.organization ?? ''}`,
            filename: `sample-${sample_to_ship.form_id}.pdf`,
            exclude: ['form_id', 'pDST result', 'gDST (LPA) result', 'gDST (Xpert) result', 'PDST Result', 'GDST (LPA) Result', 'GDST (Xpert) Result'], // shown in subtitle instead
        });
        setSample_to_ship()
        refreshRecord(Date.now())
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        if (!headers || headers.length === 0) return;
    
        const normalize = str =>
            str.replace(/\s+/g, ' ').trim().toLowerCase();
    
        setColumns(prev => {
            const excludedSet = new Set(excluded.map(normalize));
            const allowedHeaders = headers.filter(
                h => !excludedSet.has(normalize(h))
            );
            const allowedSet = new Set(allowedHeaders);
    
            // 1. Keep only columns that are still allowed (preserves user order),
            //    but NEVER drop the actions column
            const kept = prev.filter(
                c => c.accessorKey === 'actions' || allowedSet.has(c.accessorKey)
            );
    
            // 2. Add allowed headers that aren't already present
            const existing = new Set(kept.map(c => c.accessorKey));
            const added = allowedHeaders
                .filter(h => !existing.has(h))
                .map(h => ({
                    accessorKey: h,
                    header: h,
                    enableSorting: true,
                    enableColumnFilter: true,
                }));
    
            // 3. Always ensure the actions column exists — append it last
            const hasActions = kept.some(c => c.accessorKey === 'actions');
            const actionsColumn = {
                id: 'actions',
                header: '',                 // optional: no header label
                enableSorting: false,
                enableColumnFilter: false,
                cell: ({ row }) => {
                    const record = row.original;
                    const hasShipmentDate = record && 'Shipment Date' in record;
                    const hasReceiptDate = record && 'gDNA Extract Receipt Date' in record;
                    const hasResultEntry = record && 'Multiplex PCR date' in record;
                
                    return (
                        <div className="w-full flex items-center gap-3">
                        {
                            user && JSON.parse(user).organization_category !== 'NTRL' && JSON.parse(user).organization_category !== 'NRL' &&
                            <Eye 
                                className='!w-4 !h-4 cursor-pointer'
                                onClick={() => enterResult(record, 'View all')}
                            />
                        }
                        {
                            user && JSON.parse(user).organization_category === 'NTRL' &&
                            <>
                            {
                                hasShipmentDate ?
                                <Search
                                    className="h-4 w-4 cursor-pointer"
                                    onClick={() => editFormRecord(record)}
                                    title='View sample'
                                /> :
                                <Edit
                                    className="h-4 w-4 cursor-pointer"
                                    onClick={() => editFormRecord(record)}
                                    title='Edit sample'
                                />
                            }
                                
                                <span
                                    className={
                                        `text-sm 
                                        ${hasShipmentDate ? 'text-muted-foreground/30 cursor-not-allowed' : 'cursor-pointer text-accent'}`}
                                    onClick={() => hasShipmentDate ? {} : handleSampleShipping(record)}
                                >
                                {
                                    hasShipmentDate ? <CircleCheckBig className='!w-4 !h-4 text-green-600' /> : 'Ship'
                                }
                                </span>
                                {
                                    sample_to_ship && sample_to_ship.form_id === record.form_id && shipping && <span className='italic text-sm font-extralight text-muted-foreground'>Shipping...</span>
                                }
                                {
                                    hasShipmentDate && !hasReceiptDate &&
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Undo2 
                                                className="h-4 w-4 cursor-pointer"
                                                title='Undo shipping'
                                            />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle className="font-extralight">Request to revert Sample Shipment</DialogTitle>
                                            <ChangeRequest record={record} request_on='Shipment Date' />
                                        </DialogContent>
                                    </Dialog>
                                }
                            </>
                        } 
                        {
                            user && JSON.parse(user).organization_category === 'NRL' && 
                            <>
                            {
                                hasReceiptDate ?
                                <div className='flex items-center gap-2'>
                                    <span 
                                        className="text-xs text-accent cursor-pointer px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20"
                                        onClick={() => enterResult(record, 'Result Entry')}
                                    >Result Entry</span> 
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <FileSpreadsheet className='hidden !w-4 !h-4 text-green-500 hover:text-green-700 cursor-pointer' />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle className="font-extralight">Upload Deeplex Report Spreadsheet</DialogTitle>
                                            <div></div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                :
                                <span
                                    className="text-xs text-accent cursor-pointer px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20"
                                    onClick={() => editFormRecord(record)}
                                >Receive Sample</span>
                            }
                            {
                                hasReceiptDate && !hasResultEntry &&
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Undo2 
                                            className="h-4 w-4 cursor-pointer"
                                            title='Undo shipping'
                                        />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle className="font-extralight">Request to revert Sample receipt</DialogTitle>
                                        <ChangeRequest record={record} request_on='Receive Sample' />
                                    </DialogContent>
                                </Dialog>
                            }
                            </>
                        }
                        
                        </div>
                    );
                },
            };
    
            const withActions = hasActions
                ? kept                       // already present
                : [...kept, actionsColumn];  // append once
    
            // Also append if there are new columns to add
            const finalColumns = added.length > 0
                ? [
                    ...withActions.filter(c => c.accessorKey !== 'actions'),
                    ...added,
                    actionsColumn,
                ]
                : withActions;
    
            // Avoid re-render if nothing changed
            const unchanged =
                finalColumns.length === prev.length &&
                finalColumns.every((c, i) => c.accessorKey === prev[i]?.accessorKey);
    
            if (unchanged) return prev;
    
            return finalColumns;
        });
    }, [headers, excluded]);

    const datafilters = [
        {
            title: "Sample ID",
            placeholder: "filter by Sample ID..."
        },
    ]

    useEffect(() => {
        fetchOrgAddSampleRecords(token, setRecords, setError, setIsLoading)
    }, [record])

    return(
        <div className="w-full p-4 bg-background rounded-xl overflow-hidden mb-4">
            <div className='w-full'>
            {
                isLoading ? <SkeletonComponent /> :
                columns && records && <DataTable data={recordFilter} columns={columns} filterArrs={datafilters} />
            }
            </div>
            <div className='fixed z-40 pl-2 w-3/5 md:w-1/3 bg-background rounded-xl top-3 left-20 md:left-1/3 border broder-foreground flex items-center gap-1'>
                <Search className='!w-6 !h-6 text-muted-foreground/80 ' />
                <Input 
                    type="text" 
                    className="border-none text-muted-foreground !rounded-l-none !rounded-r-xl"
                    placeholder="Search sample..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    )
}

export default SampleLog