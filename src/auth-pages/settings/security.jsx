import React, { useContext, useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card";
import ProfileInformation from './profile-information';
import { AppContext } from '../../context/AppContext';
import PasswordUpdate from './password-update';
import { fetchUserRole } from '../../utils/roles';
import SkeletonComponent from '../../components/skeleton-component';
import OfficeLocationUpdate from './office-location-update';
import { Alert, AlertTitle } from '../../components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Security = () => {

    const { token, user } = useContext(AppContext);
    const [role, setRole] = useState();
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false);

    const userprofile = user && JSON.parse(user)

    useEffect(() => {
        //fetchUserRole(token, setRole, setError, setLoading)
    }, [])

    return (
        <div className='w-full space-y-4'>
            <div className='w-full grid md:grid-cols-2 gap-4'>
                <div className='col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile information</CardTitle>
                            <CardDescription>
                            Below is your profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileInformation profile={userprofile} />
                        </CardContent>
                    </Card>
                </div>
                <div className='grid gap-4 col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Password update</CardTitle>
                            <CardDescription>
                            Secure your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordUpdate />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Security