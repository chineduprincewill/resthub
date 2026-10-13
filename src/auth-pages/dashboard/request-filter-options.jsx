const RequestFilterOptions = ({ setFilter, filter }) => {

    let options = [
        { value: "pending...", label: "Pending...", color: "accent" },
        { value: "resolved...", label: "Resolved...", color: "accent" },     // red-600
        { value: "declined...", label: "Declined...", color: "accent" },
        { value: "", label: "All requests", color: "accent" }
    ];

    return (
        <div className='flex items-center gap-4 mt-4'>
        {
            options.map((option, index) => (
                <div 
                    key={index} 
                    className='flex items-center gap-2'
                    onClick={() => setFilter(option.value)}
                >
                    <span className={`w-4 h-4 rounded-full border border-${option.color} ${filter === option.value && 'bg-'+option.color} cursor-pointer`} />
                    <span className={`text-muted-foreground cursor-default text-sm`}>{option.label}</span>
                </div>
            ))
        }
        </div>
    )
}

export default RequestFilterOptions