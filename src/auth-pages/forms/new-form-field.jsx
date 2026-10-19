import ComboboxComponent from '@/components/combobox-component'
import SkeletonComponent from '@/components/skeleton-component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { fetchFormFieldCategories, fetchFormfields, getDependentFieldOptions, updateFormField } from '../../utils/forms'
import { AppContext } from '../../context/AppContext'
import ComboboxComponentSm from '../../components/combobox-component-sm'

const NewFormField = ({ forms_title, formdata, action }) => {

    const { token, refreshRecord } = useContext(AppContext);
    //const [id, setId] = useState();
    //const [formcategory, setFormcategory] = useState();
    const [forms_text, setForms_text] = useState(formdata && formdata.forms_text);
    const [forms_text_id, setForms_text_id] = useState(formdata && formdata.forms_text_id);
    const [forms_type, setForms_type] = useState(formdata && formdata.forms_type);
    const [control, setControl] = useState(formdata && formdata.control);
    const [forms_type_options, setForms_type_options] = useState(formdata && formdata.forms_type_options);
    //const [field_info, setField_info] = useState();
    const [field_trigger, setField_trigger] = useState(formdata && formdata.field_trigger);
    const [trigger_value, setTrigger_value] = useState(formdata && formdata.trigger_value);
    const [version, setVersion] = useState('1.0')
    const [is_caption, setIs_caption] = useState(formdata && formdata.is_caption)
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [adding, setAdding] = useState(false);
    const [formfields, setFormfields] = useState();
    const [loading, setLoading] = useState(false);
    //const [reloadform, setReloadform] = useState(false);
    const [categories, setCategories] = useState([]);
    const [value, setValue] = useState(formdata && formdata.forms_sub_title)
    const [d_options, setD_options] = useState();

    console.log(formdata)

    const handleUpdate = () => {

        //console.log(forms_text,forms_type, control, forms_text_id)

        if(!forms_text || !forms_type || !control || !forms_text_id){
            toast.error("One or more required fields is not selected!", {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });

            return
        }

        if((control === '1' || control == 1) && field_trigger){
            toast.error("A required field cannot depend on the value of another field!", {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });

            return
        }
        
        const data = {
            forms_title,
            forms_sub_title:value,
            forms_text,
            forms_text_id, 
            forms_type,
            control,
            forms_type_options,
            version,
            is_caption,
            field_trigger,
            trigger_value
        }

        if(formdata && action === 'edit'){
            data.id = formdata?.id
        }

        console.log(data);
        
        updateFormField(token, data, setSuccess, setError, setAdding)
            //addFormField(data, setSuccess, setError, setAdding)
    }

    if(success){
        toast.success("Form field created successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        //router.push('/forms');
        setSuccess();
        setForms_text('');
        setForms_text_id('')
        setControl('');
        setField_trigger('');
        setForms_type('');
        setForms_type_options('');
        setVersion('');
        setIs_caption('')
        setTrigger_value('');
        refreshRecord(Date.now());
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    const dependentOptions = () => {
        if (!d_options || typeof d_options !== 'string') {
            return <SelectItem value="N/A">N/A</SelectItem>;
        }
    
        const options = d_options
            .split(',')
            .map((opt) => opt.trim())
            .filter(Boolean);   // drop empty strings from trailing commas etc.
    
        if (options.length === 0) {
            return <SelectItem value="N/A">N/A</SelectItem>;
        }
    
        return options.map((opt, index) => (
            <SelectItem key={index} value={opt}>
                {opt}
            </SelectItem>
        ));
    };

    useEffect(() => {
        //fetchFormfields(data, setFormfields, setError, setLoading)
        dependentOptions()
    }, [d_options, field_trigger])

    useEffect(() => {
        fetchFormfields(token, { forms_title }, setFormfields, setError, setLoading);
    }, [])

    useEffect(() => {
        fetchFormFieldCategories(token, { forms_title }, setCategories, setError, setLoading)
    }, [])

    useEffect(() => {
        if(field_trigger && field_trigger !== 'none'){
            const data = {
                forms_text:field_trigger
            }
            getDependentFieldOptions(token, data, setD_options, setError, setLoading)
        }
    }, [field_trigger])

    return (
        <div className='w-full'>
            <div className={`w-full grid gap-4`}>
                <ComboboxComponent comboOptions={categories} value={value} setValue={setValue} />
                <Input 
                    value={forms_text}
                    placeholder="Enter field name"
                    onChange={(e) => setForms_text(e.target.value)}
                    required
                    className="w-full"
                />
                <Input 
                    value={forms_text_id}
                    placeholder="Enter field order...*"
                    onChange={(e) => setForms_text_id(e.target.value)}
                    required
                    className="w-full"
                />
                <Select
                    value={is_caption}
                    onValueChange={setIs_caption}
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select if is caption field *" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Is Caption?</SelectLabel>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <RadioGroup
                    value={(control == 1 || control === '1') ? 1 : 2}
                    className="flex items-center gap-3"
                    onValueChange={(v) => setControl(v)}
                >
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value={1} id="r1" />
                        <Label htmlFor="r1">Required</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value={2} id="r2" />
                        <Label htmlFor="r2">Not required</Label>
                    </div>
                </RadioGroup>
                <Select
                    value={forms_type}
                    onValueChange={setForms_type}
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a field type *" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Field type</SelectLabel>
                            <SelectItem value="text">text</SelectItem>
                            <SelectItem value="date">date</SelectItem>
                            <SelectItem value="number">number</SelectItem>
                            <SelectItem value="decimal">decimal</SelectItem>
                            <SelectItem value="select">select</SelectItem>
                            <SelectItem value="radio">radio</SelectItem>
                            <SelectItem value="checkbox">checkbox</SelectItem>
                            <SelectItem value="api">api</SelectItem>
                            <SelectItem value="textarea">textarea</SelectItem>
                            <SelectItem value="none">none</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {
                    (forms_type === 'select' || forms_type === 'radio' || forms_type === 'checkbox') &&
                    <Textarea 
                        value={forms_type_options ?? ''}
                        placeholder="Enter options separated with comma ','"
                        className="w-full"
                        onChange={(e) => setForms_type_options(e.target.value)}
                    />
                }
                <Select
                    value={field_trigger}
                    required
                    onValueChange={setField_trigger}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select dependent if any *" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Dependent</SelectLabel>
                            <SelectItem value="none">none</SelectItem>
                        {
                            formfields && formfields.length > 0 && formfields.map(fm => (
                                <SelectItem key={fm.id} value={fm.forms_text}>{fm.forms_text}</SelectItem>
                            ))
                        }
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {
                    field_trigger && field_trigger !== 'none'
                    &&
                    <Select
                        value={trigger_value ?? ''}
                        required
                        onValueChange={setTrigger_value}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={loading ? "loading..." : "Dependent value"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Dependent value</SelectLabel>
                                <SelectItem value="none">none</SelectItem>
                            {
                                dependentOptions()
                            }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                }
                <Button 
                    className="gradient"
                    onClick={handleUpdate}
                >
                {
                    adding ?
                    <div className='flex items-center gap-1'>
                        <Spinner className="size-4" />
                        <span>Saving...</span>
                    </div>
                    :
                    <span>Save changes</span>
                }
                </Button>
            </div>   
        </div>
    )
}

export default NewFormField