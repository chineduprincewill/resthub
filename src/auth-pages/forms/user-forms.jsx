import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useAuth } from '../../hooks/useAuth';
import SkeletonComponent from '../../components/skeleton-component';
import { fetchFormAssignments } from '../../utils/forms';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { List, Plus, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchForms } from '../../utils/resthubfunction';
import FormFields from './form-fields';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import NewFormField from './new-form-field';

const UserForms = () => {

    const { token, user } = useContext(AppContext);
    const navigate = useNavigate();
    //const { user } = useAuth()
    const [forms, setForms] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();
    const [active, setActive] = useState('Add Sample')

    const email = JSON.parse(user)?.email;

    const handleNavigation = (frm) => {
        console.log(frm);
        navigate('/form-detail', { 
          state: { 
            id: frm?.form_id, 
            title: frm?.title,
            permissions: frm?.permissions,
            uniqueid: frm?.unique_id,
            form_type: frm?.form_type,
            email: frm?.email
          } 
        });
    };

    useEffect(() => {
        user && fetchForms(token, setForms, setError, setIsLoading)
    }, [])
    
    return (
        <div className='w-full space-y-4'>
            <div className='w-full grid md:flex md:flex-wrap gap-4 md:items-center md:justify-between'>
            {
                isLoading ? <SkeletonComponent /> :
                    (forms && forms.length > 0 ?
                        forms.map((fm, index) => (
                            <Card 
                                key={index} className={`w-full md:w-[32%] hover:bg-muted-foreground/10 ${active === fm && 'bg-muted-foreground/10 hover:bg-muted-foreground/20'} cursor-pointer`}
                                onClick={() => setActive(fm)}
                            >
                                <CardContent>
                                    <div className='w-full flex justify-between items-center pt-6'>
                                        <span className='font-extralight'>{fm}</span>
                                        <SearchIcon size={20} className='text-muted-foreground hover:text-brand' />
                                    </div>
                                </CardContent>
                            </Card>
                        )) : 
                        <div className='w-full p-2 rounded-sm bg-secondary'>No form has been assigned to you at this time!</div>)
            }
            </div>

            {
                forms && !isLoading && 
                <div className='grid bg-background rounded-xl'>
                    <div className='w-full grid gap-4'>
                        <div className='flex items-center justify-between px-4 py-2 border-b border-muted-foreground/20'>
                            <span className='text-lg font-extralight'>{active} form fields</span>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className='p-1 rounded-full bg-accent/70 hover:bg-accent cursor-pointer'>
                                        <Plus className='w-6 h-6' />
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>New field</DialogTitle>
                                    <NewFormField forms_title={active} />
                                </DialogContent>
                            </Dialog>
                        </div>
                        <FormFields forms_title={active} />
                    </div>
                </div>
            }
            
        </div>
    )
}

export default UserForms