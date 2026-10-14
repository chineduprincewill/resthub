import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { getStateListFromGeoZone, loadAddSampleFormElements, submitAddSamplePayload } from '../../utils/resthubfunction';
import SkeletonComponent from '../../components/skeleton-component';
import { ChevronDownIcon, CircleArrowLeft, CircleArrowRight, Eraser, X } from 'lucide-react';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Input } from '../../components/ui/input';
import { format } from 'date-fns';
import { Dialog, DialogHeader, DialogTrigger } from '../../components/ui/dialog';
import PreviewFormdata from '../forms/PreviewFormdata';
import { Spinner } from '../../components/ui/spinner';
import ComboboxComponentSm from '../../components/combobox-component-sm';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { toast } from 'sonner';

const AddSamplePage = ({ setActive, editrecord, setEditrecord, fmtitle, step }) => {

    const formtitle = step ? step : fmtitle;
    const { token, user, refreshRecord } = useContext(AppContext);
    const [formfields, setFormfields] = useState();
    const [fetching, setFetching] = useState(false)
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState();
    const [currentCategory, setCurrentCategory] = useState(step ? (step === 'View all' ? 'Sample Information' : 'Multiplex PCR') : (formtitle === 'Add Sample' && 'Sample Information'));
    const [categories, setCategories] = useState();
    const [categoryIndex, setCategoryIndex] = useState(parseInt(0));
    const [fielderrors, setFielderrors] = useState({});
    const [formdata, setFormdata] = useState({});
    const [geostates, setGeostates] = useState();
    const [listing, setListing] = useState(false);
    const [hasOptions, setHasOptions] = useState(false);
    const [selectedField, setSelectedField] = useState();
    const [drugResults, setDrugResults] = useState({});
    const [success, setSuccess] = useState();
    const [sequencingPredictionRuns, setSequencingPredictionRuns] = useState([{}]);
    const SEQUENCING_CATEGORY = 'Sequencing-based DR Prediction';
    const sequencingFields = formfields?.filter((f) => f.forms_sub_title === SEQUENCING_CATEGORY) || [];

    const record = editrecord;
    const hasShipmentDate = record && 'Shipment Date' in record;

    function extractFormsSubTitleValues(data) {
        // Extract all forms_sub_title values and filter out any null/undefined
        const allValues = data.map(item => item.forms_sub_title).filter(value => value !== null && value !== undefined && value !== 'Shipping Information');
        
        // Return only unique values
        return [...new Set(allValues)];
    }

    const getSequencingValue = (runIndex, fieldName) => sequencingPredictionRuns[runIndex]?.[fieldName] ?? '';
      
    const setSequencingValue = (runIndex, field, value) => {
        setSequencingPredictionRuns((prev) => {
          const next = [...prev];
          next[runIndex] = { ...next[runIndex], [field.forms_text]: value };
          return next;
        });
      
        // still fire validation for error display
        const error = validateField(field, value, sequencingPredictionRuns[runIndex] || {});
        setFielderrors((prev) => ({
          ...prev,
          [`${field.forms_text}-${runIndex}`]: error,
        }));
    };
      
    const addSequencingRun = () => setSequencingPredictionRuns((p) => [...p, {}]);
      
    const removeSequencingRun = (runIndex) => setSequencingPredictionRuns((p) => p.filter((_, i) => i !== runIndex));

    /**const navigateForward = () => {
        const ci = parseInt(categoryIndex) + 1;
        setCategoryIndex(ci);
    }*/

    const navigateForward = () => {
        const errors = validateForm();
    
        // Only care about errors belonging to the current category
        const currentCategoryErrors = formfields
            .filter(f => f.forms_sub_title === currentCategory)
            .map(f => errors[f.forms_text])
            .filter(Boolean);
    
        if (currentCategoryErrors.length > 0) {
            showValidationToast(
                Object.fromEntries(
                    Object.entries(errors).filter(([k]) =>
                        formfields.some(f => f.forms_text === k && f.forms_sub_title === currentCategory)
                    )
                )
            );
            return;
        }
    
        setCategoryIndex(parseInt(categoryIndex) + 1);
    };    

    const navigateBackward = () => {
        const ci = parseInt(categoryIndex) - 1;
        setCategoryIndex(ci);
    }

    const handleKeyDown = (e, field) => {
        if (field.forms_type !== "number" && field.forms_type !== "decimal") return;
      
        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab"
        ];
      
        // Allow control keys
        if (allowedKeys.includes(e.key)) return;
      
        // Block non-numeric keys
        if ((!/^[0-9]$/.test(e.key)) && (!/^[0-9.]$/.test(e.key))) {
          e.preventDefault();
        }
    };

    // Radio button (S / R)
    /**const handleRadioChange = (fld, drug, patch) => {
        const current = formdata[fld.forms_text] || {};
        const row = current[drug] || { result: '', date: '' };
      
        const nextValue = {
          ...current,
          [drug]: { ...row, ...patch },
        };
      
        // reuse the same pipeline as every other field
        handleInputChange(fld, fld.forms_text, nextValue);
    };

    const handleInputChange = (fld, name, value) => {

        //console.log(name, value);
        setSelectedField(name);
        console.log(fld.forms_type);
        // Apply conditional validation
        if (fld.forms_type === "number") {
            value = value.replace(/[^0-9]/g, ""); // digits only
        }

        if (fld.forms_type === "decimal") {
            value = value.replace(/[^0-9.]/g, ""); // allow decimal
        }

        /**if(name === 'Geopolitical Zone'){
            getStateListFromGeoZone({ geozone_selected : value }, setGeostates, setError, setListing)
        }

        setFormdata({
            ...formdata,
            [name]: value
        });

        // Validate this field immediately
        const error = validateField(fld, value, {
            ...formdata,
            [fld.forms_text]: value
        });

        setFielderrors((prev) => ({
            ...prev,
            [fld.forms_text]: error
        }));
    } */

    const handleRadioChange = (fld, drug, patch) => {
        const raw = formdata[fld.forms_text];
        const current =
            raw && typeof raw === 'object' && !Array.isArray(raw)
                ? raw
                : parseRadioValue(raw);
    
        const row = current[drug] || { result: '', date: '' };
        const nextValue = { ...current, [drug]: { ...row, ...patch } };
    
        handleInputChange(fld, fld.forms_text, nextValue);
    };
    
    const handleInputChange = (fld, name, value) => {
        setSelectedField(name);
    
        if (fld.forms_type === "number") {
            value = value.replace(/[^0-9]/g, "");
        }
        if (fld.forms_type === "decimal") {
            value = value.replace(/[^0-9.]/g, "");
        }
    
        setFormdata((prev) => ({
            ...prev,
            //[name]: fld.forms_type === "checkbox" ? name : value,
            [name]: value, 
        }));
    
        const error = validateField(fld, value, {
            ...formdata,
            [fld.forms_text]: value,
        });
    
        setFielderrors((prev) => ({
            ...prev,
            [fld.forms_text]: error,
        }));
    };

    const getSelectFieldOptions = (fieldoptions) => {
        let options;

        /**if(selectedField === 'Geopolitical Zone'){
            options = geostates && geostates;
        }
        else{
            options = fieldoptions;
        }*/
        options = fieldoptions;
        //console.log(options);
        return options;
    }

    const clearRadioGroup = (field) => {
        const cleared = {};
      
        // seed every option with empty result + empty date
        (field.forms_type_options || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((drug) => {
            cleared[drug] = { result: '', date: '' };
          });
      
        handleInputChange(field, field.forms_text, cleared);
    };

    const shouldRenderField = (field, formData) => {
        // No trigger config → always render
        if (!field.field_trigger || field.trigger_value == null || field.trigger_value === '') {
            return true;
        }
    
        // Trigger field must exist in formdata
        if (!(field.field_trigger in formData)) return false;
    
        const actual = formData[field.field_trigger];
        const expected = field.trigger_value;
    
        // Normalize both sides to trimmed strings for comparison
        const normalize = (v) => (v == null ? '' : String(v).trim());
    
        // Support comma-separated trigger values (any match passes)
        const expectedList = String(expected)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
    
        const actualStr = normalize(actual);
    
        // For array values (checkbox), any element matching passes
        if (Array.isArray(actual)) {
            const actualSet = actual.map(normalize);
            return expectedList.some(v => actualSet.includes(v));
        }
    
        return expectedList.includes(actualStr);
    };
    
    function validateField(field, value, formData) {
        if (field.control === 1) {
            const isEmpty =
                value == null ||
                value === '' ||
                (typeof value === 'string' && value.trim() === '') ||
                (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
                return `${field.forms_text} is required`;
            }
        }
        return null;
    }

    const validateForm = () => {
        let newErrors = {};
      
        formfields.forEach((field) => {
            if (!shouldRenderField(field, formdata)) return;
            if (field.forms_sub_title === SEQUENCING_CATEGORY) return; // handled below

            const value = formdata[field.forms_text];
            const error = validateField(field, value, formdata);
      
            if (error) {
                newErrors[field.forms_text] = error;
            }
        });

        // sequencing runs
        sequencingPredictionRuns.forEach((run, i) => {
            sequencingFields.forEach((field) => {
            const err = validateField(field, run[field.forms_text], run);
            if (err) newErrors[`${field.forms_text}-${i}`] = err;
            });
        });
      
        setFielderrors(newErrors);
      
        //return Object.keys(newErrors).length === 0;
        return newErrors;
    };

    //const formsSubTitleArray = formfields && extractFormsSubTitleValues(formfields);
    //console.log(formsSubTitleArray);

    // helper — object -> array tuples, ordered by forms_type_options
    const objectToTupleArray = (obj = {}, options = []) =>
        options.map((drug) => {
            const row = obj[drug] || {};
            return [drug, row.result ?? '', row.date ?? ''];
        }
    ).filter(([, result, date]) => result && date);

    const buildSubmitPayload = () => {
        const payload = {
            ...formdata,
            ...(editrecord && editrecord?.form_id && { form_id: editrecord.form_id }),
        };
    
        formfields?.forEach((f) => {
            if (!shouldRenderField(f, formdata)) {
                delete payload[f.forms_text];
                return;
            }

            // skip sequencing fields — they go in as the array instead
            if (f.forms_sub_title === SEQUENCING_CATEGORY) {
                delete payload[f.forms_text];
                return;
            }

            if (f.forms_type === 'radio') {
                const options = (f.forms_type_options || '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
    
                payload[f.forms_text] = objectToTupleArray(
                    formdata[f.forms_text] || {},
                    options
                );
            }

            if (f.forms_type === 'checkbox') {
                const v = formdata[f.forms_text];
                payload[f.forms_text] = Array.isArray(v) ? v.join(',') : (v ?? '');
            }
        });

        // the array of sequencing objects, only for runs that have data
        const sequencingPayload = sequencingPredictionRuns
        .map((run) =>
            Object.fromEntries(
            Object.entries(run).filter(([, v]) => v !== '' && v != null)
            )
        )
        .filter((run) => Object.keys(run).length > 0);

        if (sequencingPayload.length > 0) {
            payload[SEQUENCING_CATEGORY] = JSON.stringify(sequencingPayload);
        }
    
        return payload;
    };

    // Parse the tuple-array string back to object format for radio fields
    const parseRadioValue = (value) => {
        if (!value) return {};
    
        // Case A: already an object (new format, or already-normalized)
        if (typeof value === 'object' && !Array.isArray(value)) {
            return value;
        }
    
        // Case B: array of tuples (auto-parsed JSON), or JSON string (old format)
        try {
            const arr = typeof value === 'string' ? JSON.parse(value) : value;
            if (!Array.isArray(arr)) return {};
    
            return arr.reduce((acc, [drug, result, date]) => {
                acc[drug] = { result: result ?? '', date: date ?? '' };
                return acc;
            }, {});
        } catch (e) {
            console.error('Failed to parse radio value:', value, e);
            return {};
        }
    };

    const showValidationToast = (errors) => {
        const errorList = Object.values(errors).filter(Boolean);
    
        if (errorList.length === 0) return;
    
        toast.error(
            errorList.length === 1
                ? errorList[0]
                : `${errorList.length} required fields are missing`,
            {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                description: errorList.length > 1
                    ? errorList.slice(0, 4).join(' • ') +
                      (errorList.length > 4 ? ` • +${errorList.length - 4} more` : '')
                    : undefined,
                descriptionClassName: "!text-white font-extralight text-sm",
                duration: 5000,
            }
        );
    };

    const scrollToFirstError = (errors) => {
        const firstKey = Object.keys(errors)[0];
        if (!firstKey) return;
    
        // matches the field.forms_text used in your rendered inputs
        const el = document.querySelector(`[name="${CSS.escape(firstKey)}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus?.();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        //if (!validateForm()) return; // optional — keep your existing validation
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            showValidationToast(errors);
            scrollToFirstError(errors);
            return;
        }

        const payload = buildSubmitPayload();   // <── call this
        //console.log(payload);  
        submitAddSamplePayload(token, { payload }, setSuccess, setError, setSubmitting)                 
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now())
        setActive('log')
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        loadAddSampleFormElements(token, { formtitle }, setFormfields, setError, setFetching)
    }, [])

    useEffect(() => {
        formfields && setCategories(formfields && extractFormsSubTitleValues(formfields))
    }, [formfields])    

    useEffect(() => {
        //categories && console.log(categories[categoryIndex]?.value)
        categories && setCurrentCategory(categories[categoryIndex])
    }, [categoryIndex])

    useEffect(() => {
        if (!formfields) return;
    
        setFormdata((prev) => {
            let changed = false;
            const next = { ...prev };
    
            formfields.forEach((field) => {
                const visible = shouldRenderField(field, prev);
                const key = field.forms_text;
    
                if (!visible && key in next) {
                    delete next[key];
                    changed = true;
                }
            });
    
            return changed ? next : prev;
        });
    }, [formdata, formfields]);

    useEffect(() => {
        if (editrecord && formfields) {
            const transformed = { ...editrecord };
            
            // Transform radio field values from tuple-array strings to objects
            formfields.forEach((field) => {
                if (field.forms_sub_title === SEQUENCING_CATEGORY) {
                    delete transformed[field.forms_text];
                    return;
                }

                if (field.forms_type === 'radio' && transformed[field.forms_text] != null) {
                    //transformed[field.forms_text] = parseRadioValue(transformed[field.forms_text]);
                    const before = transformed[field.forms_text];
                    const after = parseRadioValue(before);
                    console.log('[radio parse]', field.forms_text, { before, after });
                    transformed[field.forms_text] = after;
                }

                // Normalize date fields
                if (field.forms_type === 'date' && transformed[field.forms_text]) {
                    const d = new Date(transformed[field.forms_text]);
                    if (!isNaN(d.getTime())) {
                        transformed[field.forms_text] = d.toISOString();
                    }
                }
            });
            
            setFormdata(transformed);
        } else if (editrecord) {
            // Fallback: set as-is until formfields load
            setFormdata(editrecord);
        }
    }, [editrecord, formfields]);

    useEffect(() => {
        if (editrecord && formfields) {
            const fieldKeys = formfields.map(f => f.forms_text);
            const recordKeys = Object.keys(editrecord);
            console.log('Record keys:', recordKeys);
            console.log('Field keys:', fieldKeys);
            console.log('Unmatched record keys:', recordKeys.filter(k => !fieldKeys.includes(k)));
        }
    }, [editrecord, formfields]);

    useEffect(() => {
        if (editrecord && editrecord[SEQUENCING_CATEGORY]) {
          try {
            const arr =
              typeof editrecord[SEQUENCING_CATEGORY] === 'string'
                ? JSON.parse(editrecord[SEQUENCING_CATEGORY])
                : editrecord[SEQUENCING_CATEGORY];
      
            if (Array.isArray(arr) && arr.length) {
              setSequencingPredictionRuns(arr);
            }
          } catch (e) {
            console.error('Failed to parse sequencing payload', e);
          }
        }
    }, [editrecord]);

    console.log(editrecord)
    console.log('formdata gDST:', formdata['gDST (LPA) result']);

    return (
        <div className="p-2 md:px-4 md:py-0">
        {
            fetching ?
            <SkeletonComponent /> :
            <form
                onSubmit={handleSubmit}
                className='w-full rounded-sm bg-background grid md:flex md:flex-wrap md:items-start gap-6 px-6 py-2'
            >
                <div className='w-full bg-accent/10 gap-2 flex items-center justify-between p-2 my-2 border-b rounded-md'>
                    <CircleArrowLeft 
                        size={30} 
                        className={`cursor-pointer ${categoryIndex === 0 && 'text-background cursor-not-allowed'}`} 
                        onClick={() => categoryIndex > 0 && navigateBackward()}
                    />
                    <span className='md:text-xl'>{currentCategory ? currentCategory : (
                        categories && categories[0]?.value
                    )}</span>
                    <CircleArrowRight 
                        size={30} 
                        className={`cursor-pointer ${categories && categoryIndex === (categories.length - 1) && 'text-background cursor-not-allowed'}`}
                        onClick={() => categories && categoryIndex < (categories.length - 1) && navigateForward()}
                    />
                </div>
                {formfields && formfields.map((field) => {
                    if (!shouldRenderField(field, formdata)) return null;
                    if (field.forms_sub_title === SEQUENCING_CATEGORY) return null;

                    return <div key={field.id} 
                        className={
                            `w-full 
                            ${field?.forms_sub_title !== 'Culture/DST' ? 'md:w-[30%]' : (
                                field.forms_text.includes('result') && 'md:w-[30%] md:gap-2'
                            )} 
                            ${field?.forms_sub_title === currentCategory || (!currentCategory && categories && field?.forms_sub_title === categories[0]) ? 'grid' : 'hidden'}`
                            }
                        >
                        <Label className={`block text-sm font-medium mb-2 ${field.forms_text.includes('result') && 'p-2 flex justify-between items-center border border-accent bg-accent/5'}`}>
                            <div className='flex items-center gap-0'>
                            {field.forms_text}
                            {field.control === 1 && <span className="text-destructive ml-1">*</span>}
                            {field.field_info && <span className="ml-2 text-xs text-foreground/40">{field.field_info}</span>}
                            </div>
                        {
                            field.forms_text.includes('result') &&
                            <Eraser 
                                className='!w-4 !h-4 cursor-pointer hover:text-muted-foreground' 
                                onClick={() => clearRadioGroup(field)}
                            />
                        }
                        </Label>
                        {field.forms_type === 'textarea' ? (
                            <Textarea 
                                placeholder={field.forms_text}
                                onChange={(e) => handleInputChange(field, field.forms_text, e.target.value)}
                                name={field.forms_text}
                                value={formdata[field.forms_text] || ''} // Changed from editinfo
                            />
                        ) : field.forms_type === 'select' && (field.forms_type_options || field.forms_type_options === "") ? (
                            (() => {
                                const rawValue = formdata[field.forms_text];
                                const normalizedValue = rawValue != null ? String(rawValue).trim() : '';
                                const options = getSelectFieldOptions(field.forms_type_options)
                                    .split(',')
                                    .map(o => o.trim())
                                    .filter(Boolean);
                                
                                // Radix drops values not present in options — fall back to ''
                                const safeValue = options.includes(normalizedValue) ? normalizedValue : '';
                                
                                return (
                                    <Select
                                        value={safeValue}
                                        onValueChange={(value) => handleInputChange(field, field.forms_text, value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={listing ? `listing ${field.forms_text}` : `Select value`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{field.forms_text}</SelectLabel>
                                                {!listing && options.map((opt, index) => (
                                                    <SelectItem key={index} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                );
                            })()
                        ) : field.forms_type === 'checkbox' ? (
                            (() => {
                                const options = (field.forms_type_options || '')
                                    .split(',')
                                    .map(s => s.trim())
                                    .filter(Boolean);
                        
                                // Normalize stored value into an array
                                const raw = formdata[field.forms_text];
                                const selected = Array.isArray(raw)
                                    ? raw
                                    : typeof raw === 'string' && raw !== ''
                                        ? raw.split(',').map(s => s.trim()).filter(Boolean)
                                        : [];
                        
                                const toggle = (option, checked) => {
                                    const next = checked
                                        ? [...new Set([...selected, option])]
                                        : selected.filter(v => v !== option);
                                    handleInputChange(field, field.forms_text, next);
                                };
                        
                                // If no options are defined, fall back to a single boolean checkbox
                                if (options.length === 0) {
                                    return (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={field.forms_text}
                                                checked={!!formdata[field.forms_text]}
                                                className="rounded !w-4 !h-4"
                                                onChange={(e) =>
                                                    handleInputChange(field, field.forms_text, e.target.checked)
                                                }
                                            />
                                            <span className="text-sm">{field.forms_text}</span>
                                        </label>
                                    );
                                }
                        
                                return (
                                    <div className="flex flex-wrap gap-3">
                                        {options.map((option, i) => {
                                            const id = `cb-${field.id}-${i}`;
                                            const isChecked = selected.includes(option);
                                            return (
                                                <label
                                                    key={option}
                                                    htmlFor={id}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={id}
                                                        name={field.forms_text}
                                                        value={option}
                                                        checked={isChecked}
                                                        className="rounded w-6 h-6"
                                                        onChange={(e) => toggle(option, e.target.checked)}
                                                    />
                                                    <span className="text-sm">{option}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                );
                            })()
                        ) : field.forms_type === 'date' ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between text-left font-normal"
                                    >
                                        {formdata[field.forms_text] ? 
                                            format(new Date(formdata[field.forms_text]), 'PPP') : 
                                            <span>Pick a date</span>
                                        }
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        fromYear={1900}
                                        toYear={new Date().getFullYear() + 30} // 10 years in future
                                        selected={formdata[field.forms_text] ? new Date(formdata[field.forms_text]) : undefined}
                                        onSelect={(date) => handleInputChange(field, field.forms_text, date)}    
                                    />
                                </PopoverContent>
                            </Popover>
                        ) : field.forms_type === 'api' ? (
                            <ComboboxComponentSm 
                                data={field} 
                                handleInputChange={handleInputChange}
                                value={formdata[field.forms_text] || ''}
                            />
                        )  : field.forms_type === 'radio' ? (
                            field.forms_type_options.split(',').map((drug) => {
                              const row =
                                formdata[field.forms_text]?.[drug] || { result: '', date: '' };
                              const groupName = `radio-${field.forms_text}-${drug}`;
                              
                              console.log('radio row', field.forms_text, drug, row);

                              return (
                                <div
                                  key={drug}
                                  className="flex flex-col md:flex-row md:items-center gap-2 pb-4 border-b last:border-b-0"
                                >
                                  <div className="md:w-2/6 font-semibold text-sm">{drug}</div>
                          
                                  <RadioGroup
                                    value={row.result}
                                    onValueChange={(v) =>
                                      handleRadioChange(field, drug, { result: v })
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <div className="flex items-center gap-1">
                                      <RadioGroupItem value="S" id={`${groupName}-S`} />
                                      <Label htmlFor={`${groupName}-S`} className="cursor-pointer font-extralight">
                                        S
                                      </Label>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <RadioGroupItem value="R" id={`${groupName}-R`} />
                                      <Label htmlFor={`${groupName}-R`} className="cursor-pointer font-extralight">
                                        R
                                      </Label>
                                    </div>
                                  </RadioGroup>
                          
                                  <div className="flex-1 md:ml-auto md:max-w-xs">
                                    <Input
                                      type="date"
                                      value={row.date}
                                      onChange={(e) =>
                                        handleRadioChange(field, drug, { date: e.target.value })
                                      }
                                      aria-label={`${drug} date`}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )  : field.forms_type === 'text' && (
                            <Input 
                                type={field.forms_type}
                                name={field.forms_text}
                                value={formdata[field.forms_text] || ''} // Changed from editinfo
                                placeholder={`Enter value`}
                                required={field.control === 1 && 'required'}
                                className="w-full"
                                onChange={(e) => handleInputChange(field, field.forms_text, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, field)}
                                inputMode={(field.forms_type === 'number' || field.forms_type === 'decimal') && "numeric"}
                                pattern={(field.forms_type === 'number' || field.forms_type === 'decimal') && "[0-9]*"}
                            />
                        )}
                        {/* ✅ Error Message */}
                        {fielderrors[field.forms_text] && (
                            <div className='py-1 text-red-600 my-1 text-xs'>
                            {fielderrors[field.forms_text]}
                            </div>
                        )}
                    </div>
                })}

                {currentCategory === SEQUENCING_CATEGORY && sequencingFields.length > 0 && (
                    <div className='w-full max-h-72 border p-2'>
                        <table className="w-full border-collapse text-sm">
                            <thead className="sticky top-0 z-10 bg-background">
                                <tr className="bg-accent/10">
                                {sequencingFields.map((field) => (
                                    <th
                                    key={field.id}
                                    className="border p-2 text-left font-medium whitespace-nowrap"
                                    >
                                    {field.forms_text}
                                    {field.control === 1 && (
                                        <span className="text-destructive ml-1">*</span>
                                    )}
                                    </th>
                                ))}
                                <th className="border p-2 w-[1%]" />
                                </tr>
                            </thead>
                            <tbody>
                                {sequencingPredictionRuns.map((run, runIndex) => (
                                <tr key={runIndex} className="align-top">
                                    {sequencingFields.map((field) => {
                                    const value = getSequencingValue(runIndex, field.forms_text);
                                    const errorKey = `${field.forms_text}-${runIndex}`;

                                    return (
                                        <td key={field.id} className="border p-2 min-w-[140px]">
                                        {field.forms_type === 'textarea' ? (
                                            <Textarea
                                            value={value}
                                            onChange={(e) =>
                                                setSequencingValue(runIndex, field, e.target.value)
                                            }
                                            className="w-full"
                                            />
                                        ) : field.forms_type === 'select' ? (
                                            <Select
                                            value={value}
                                            onValueChange={(v) =>
                                                setSequencingValue(runIndex, field, v)
                                            }
                                            >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                {(field.forms_type_options || '')
                                                    .split(',')
                                                    .map((o) => o.trim())
                                                    .filter(Boolean)
                                                    .map((opt, i) => (
                                                    <SelectItem key={i} value={opt}>
                                                        {opt}
                                                    </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                            </Select>
                                        ) : field.forms_type === 'date' ? (
                                            <Input
                                            type="date"
                                            value={value}
                                            onChange={(e) =>
                                                setSequencingValue(runIndex, field, e.target.value)
                                            }
                                            className="w-full"
                                            />
                                        ) : (
                                            <Input
                                            type={
                                                field.forms_type === 'number' ||
                                                field.forms_type === 'decimal'
                                                ? 'text'
                                                : field.forms_type
                                            }
                                            value={value}
                                            onChange={(e) =>
                                                setSequencingValue(runIndex, field, e.target.value)
                                            }
                                            onKeyDown={(e) => handleKeyDown(e, field)}
                                            className="w-full"
                                            />
                                        )}

                                        {fielderrors[errorKey] && (
                                            <div className="text-red-600 text-xs mt-1">
                                            {fielderrors[errorKey]}
                                            </div>
                                        )}
                                        </td>
                                    );
                                    })}

                                    <td className="border p-2 text-center align-middle">
                                    <button
                                        type="button"
                                        onClick={() => removeSequencingRun(runIndex)}
                                        disabled={sequencingPredictionRuns.length === 1}
                                        className="text-destructive hover:opacity-70 disabled:opacity-30"
                                        aria-label={`Remove run ${runIndex + 1}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-3">
                            <Button type="button" variant="outline" onClick={addSequencingRun}>
                                + Add another run
                            </Button>
                        </div>
                    </div>
                )}
                <div className='w-full bg-accent/10 gap-2 flex items-center justify-between p-2 my-2 border-t rounded-md'>
                    <CircleArrowLeft 
                        size={30} 
                        className={`cursor-pointer ${categoryIndex === 0 && 'text-background cursor-not-allowed'}`} 
                        onClick={() => categoryIndex > 0 && navigateBackward()}
                    />
                    <span className='md:text-xl'>{currentCategory ? currentCategory : (
                        categories && categories[0]?.value
                    )}</span>
                    <CircleArrowRight 
                        size={30} 
                        className={`cursor-pointer ${categories && categoryIndex === (categories.length - 1) && 'text-background cursor-not-allowed'}`}
                        onClick={() => categories && categoryIndex < (categories.length - 1) && navigateForward()}
                    />
                </div>
                <div className='w-full flex flex-wrap items-center gap-4 justify-end'>
                {
                    //categories && categoryIndex === (categories.length - 1) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='border hover:bg-foreground/20 text-sm px-4 py-2 rounded-md max-w-max cursor-pointer'>
                                <span>Preview</span>
                            </div>
                        </DialogTrigger>
                        <DialogHeader></DialogHeader>
                        <PreviewFormdata formdata={buildSubmitPayload()} />
                    </Dialog>
                    
                } 
                {
                    (user && JSON.parse(user).organization_category === 'NTRL' && hasShipmentDate) || step === 'View all' ?
                    <></> :
                    <Button type="submit">
                    {
                        submitting ?
                        <div className='flex items-center gap-1'>
                            <Spinner className="size-4" />
                            <span>Saving...</span>
                        </div>
                        :
                        <span>Save</span>
                    }
                    </Button>
                } 
                </div>
            </form>
        }

            {/**<div className='w-full fixed bottom-0 left-0 right-0 h-[50vh] z-40 rounded-t-2xl drop-shadow-2xl bg-background p-4 border border-muted-foreground/40'></div>*/}
        </div>
    )
}

export default AddSamplePage