import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';

const FilterOptions = ({ setFilter, filter }) => {

    const { user } = useContext(AppContext)

    let options;

    options = user && JSON.parse(user).organization_category === 'NTRL' ? [
        { value: "Awaiting sample shipment", label: "Awaiting sample shipment", color: "accent" },
    ] : 
    (
        user && JSON.parse(user).organization_category === 'NRL' ? 
        [
            { value: "Awaiting sample receipt", label: "Awaiting sample receipt", color: "accent" },     // red-600
            { value: "Awaiting result entry", label: "Awaiting result entry", color: "accent" },
            { value: "Result entered", label: "Result entered", color: "accent" }
        ] :
        [
            { value: "Awaiting sample shipment", label: "Awaiting sample shipment", color: "accent" },
            { value: "Awaiting sample receipt", label: "Awaiting sample receipt", color: "accent" },     // red-600
            { value: "Awaiting result entry", label: "Awaiting result entry", color: "accent" },
            { value: "Result entered", label: "Result entered", color: "accent" }
        ]
    )


    return (
        <div className='flex items-center gap-4'>
        {
            options.map((option, index) => (
                <div 
                    key={index} 
                    className='flex items-center gap-2'
                    onClick={() => setFilter(option.value)}
                >
                    <span className={`w-4 h-4 rounded-full border border-${option.color} ${filter === option.value && 'bg-'+option.color} cursor-pointer`} />
                    <span className={`text-muted-foreground cursor-default`}>{option.label}</span>
                </div>
            ))
        }
        </div>
    )
}

export default FilterOptions