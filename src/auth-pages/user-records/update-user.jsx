import React, { useContext, useEffect, useState } from 'react'
import ComboboxComponent from '../../components/combobox-component'
import { AppContext } from '../../context/AppContext'
import { getOptions, updateUser } from '../../utils/users'
import { fetchOptions } from '../../utils/resthubfunction'
import ComboboxComponent2 from '../../components/combobox-component2'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'

const UpdateUser = ({ usr}) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [organizations, setOrganizations] = useState()
    const [privileges, setPrivileges] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false)
    const [organization, setOrganization] = useState(usr && usr.organization)
    const [privilege, setPrivilege] = useState(usr && usr.organization_category)
    const [name, setName] = useState(usr && usr.name)
    const [email, setEmail] = useState(usr && usr.email)
    const [states, setStates] = useState()
    const [state, setState] = useState(usr && usr.state)
    const [phone, setPhone] = useState(usr && usr.phone)
    const [success, setSuccess] = useState()
    const [updating, setUpdating] = useState(false)

    const handleUpdate = (e) => {
        e.preventDefault()

        const data = {
            id:usr.id,
            fullname:name,
            phone,
            organization,
            privilege,
            state
        }
        if(window.confirm(`Confirm that you want to update ${name} account information`)){
            updateUser(token, data, setSuccess, setError, setUpdating)
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
        getOptions(token, 'organizations', setOrganizations, setError, setFetching)
    }, [])

    useEffect(() => {
        getOptions(token, 'privileges', setPrivileges, setError, setFetching)
    }, [])

    useEffect(() => {
        fetchOptions(token, 'geo-states', setStates, setError, setFetching)
    }, [])

    //console.log(organizations, privileges, states)

    return (
        <form onSubmit={handleUpdate} className='grid gap-4'>
            <span className='px-4 text-muted-foreground text-sm'>{usr.name}</span>
            <span className='px-4 text-muted-foreground text-sm'>{usr.email}</span>
            <Input 
                type="text" 
                value={phone}z
                className="px-4"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone no..."
            />
            <ComboboxComponent comboOptions={organizations} value={organization} setValue={setOrganization} fetching={fetching} plc={'select organization...'} />
            <ComboboxComponent comboOptions={privileges} value={privilege} setValue={setPrivilege} fetching={fetching} plc={'select privilege...'} />
            <ComboboxComponent2 comboOptions={states} value={state} setValue={setState} fetching={fetching} plc={'select state...'} />
            <Button
                type="submit"
                disabled={updating}
                className="w-full h-11 bg-accent hover:bg-accent/80 text-primary-foreground font-semibold rounded-lg transition disabled:opacity-70"
            >
                {updating ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                </span>
                ) : (
                "Update"
                )}
            </Button>
        </form>
    )
}

export default UpdateUser