import React from 'react'

const StatusOptions = ({ setFilter, filter }) => {

    let options;

    options = [
        { value: "1", label: "Active", color: "accent" },     // red-600
        { value: "0", label: "Diabled", color: "accent" }
    ]


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

export default StatusOptions