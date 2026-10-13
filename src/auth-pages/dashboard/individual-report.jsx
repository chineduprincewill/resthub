import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import ComboboxComponent from '../../components/combobox-component'
import { Button } from '../../components/ui/button';
import { AppContext } from '../../context/AppContext';
import { getIndividualDashboardReport, getSamplesForDashboard } from '../../utils/resthubfunction';
import IndividualResultTable from './individual-result-table';

const IndividualReport = () => {

    const { token } = useContext(AppContext);
    const [value, setValue] = useState();
    const [samples, setSamples] = useState([]);
    const [running, setRunning] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState();
    const [report, setReport] = useState();

    const handleRun = (e) => {
        e.preventDefault();

        getIndividualDashboardReport(token, { sampleid : value }, setReport, setError, setRunning)
    }

    const handleExportPDF = () => {
        console.log("Exporting to PDF...");
        // Implement PDF export logic here
    };

    useEffect(() => {
        getSamplesForDashboard(token, setSamples, setError, setFetching)
    }, [])

    return (
        <div className='w-full grid-4'>
            <Card className="w-full mb-4">
                <CardHeader>
                    <CardTitle>Individual report</CardTitle>
                    <CardDescription>
                    Generate report for individual sample
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRun} className="w-full grid md:flex md:items-center gap-4">
                        <ComboboxComponent comboOptions={samples} value={value} setValue={setValue} fetching={fetching} />
                        <Button
                            className="bg-accent hover:bg-accent/80 w-24"
                        >
                        {
                            running ? 
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            :
                            <span>Run</span>
                        }
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="w-full mb-4">
                <CardHeader>
                    <CardTitle>Result</CardTitle>
                    <CardDescription>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                {
                    report && 
                    <IndividualResultTable 
                        data={report} 
                        onExportPDF={handleExportPDF}
                    />
                }
                </CardContent>
            </Card>
        </div>
    )
}

export default IndividualReport