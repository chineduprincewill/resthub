import React, { useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'

const ProfileInformation = ({ profile }) => {

    console.log(profile)

    const [fullname, setFullname] = useState(profile && profile?.name ? profile?.name : '');
    const [email, setEmail] = useState(profile && profile?.email ? profile?.email : '');
    const [phone, setPhone] = useState(profile && profile?.phone ? profile?.phone : '');
    const [access, setAccess] = useState(profile && profile?.organization_category ? profile?.organization_category : '');
    const [state, setState] = useState(profile && profile?.state ? profile?.state : '');
    const [organization, setOrganization] = useState(profile && profile?.organization ? profile?.organization : '');

    return (
        <form className='w-full grid gap-4'>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Full name</Label>
                <Input 
                    value={fullname}
                    placeholder="Enter full name..."
                    onChange={(e) => setFullname(e.target.value)} // Updates the state on selection
                    readOnly
                    className="w-full"
                />
            </div>
            <div className="grid gap-3 w-full">
                <Label htmlFor="title-1">Email</Label>
                <Input 
                    type="email"
                    value={email}
                    placeholder="Enter email..."
                    onChange={(e) => setEmail(e.target.value)} // Updates the state on selection
                    readOnly
                    className="w-full"
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Phone</Label>
                <Input 
                    value={phone}
                    placeholder="Enter phone..."
                    onChange={(e) => setPhone(e.target.value)} // Updates the state on selection
                    readOnly
                    className="w-full"
                />
            </div>
            <div className="grid gap-3 w-full">
                <Label htmlFor="title-1">Access Category</Label>
                <Input 
                    type="email"
                    value={access}
                    placeholder="Enter directorate..."
                    onChange={(e) => setAccess(e.target.value)} // Updates the state on selection
                    readOnly
                    className="w-full"
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">State</Label>
                <Input 
                    value={state}
                    placeholder="Enter state..."
                    onChange={(e) => setState(e.target.value)} // Updates the state on selection
                    readOnly
                    className="w-full"
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Organization</Label>
                <Input 
                    value={organization}
                    placeholder="Enter state..."
                    onChange={(e) => setOrganization(e.target.value)} // Updates the state on selection
                    readOnly
                    className="w-full"
                />
            </div>
        </form>
    )
}

export default ProfileInformation