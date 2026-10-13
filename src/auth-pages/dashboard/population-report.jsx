import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import LocationCategoryChart from './location-category-chart';
import PopulationReportTabs from './population-report-tabs';
import HivStatusCategoryChart from './hivstatus-category-chart';
import SexCategoryChart from './sex-category-chart';
import AgeCategoryChart from './age-category-chart';
import StateCategoryChart from './state-category-chart';

const PopulationReport = () => {
    const [currentStatus, setCurrentStatus] = useState('Geopolitical Zone');

    const renderChart = () => {
            switch (currentStatus) {
            case 'Geopolitical Zone': return <LocationCategoryChart />;
            case 'HIV Status':        return <HivStatusCategoryChart />;
            case 'Sex':               return <SexCategoryChart />;
            case 'Age':               return <AgeCategoryChart />;
            case 'State':             return <StateCategoryChart />;
            default:                  return <LocationCategoryChart />;
            }
    };

    return (
        <Card className="w-full mb-4">
        <CardHeader>
            <CardTitle>Population report</CardTitle>
            <CardDescription>Generate report for population</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <PopulationReportTabs
                currentStatus={currentStatus}
                setCurrentStatus={setCurrentStatus}
            />
            {renderChart()}
        </CardContent>
        </Card>
    );
};

export default PopulationReport;