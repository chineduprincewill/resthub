import React, { useContext, useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { generateHexColors, getUniqueKeys } from '../../utils/functions';
import { AppContext } from '../../context/AppContext';
import { populationAgeChart } from '../../utils/resthubfunction';
import SkeletonComponent from '../../components/skeleton-component';

const AgeCategoryChart = () => {
    const { token } = useContext(AppContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) return; // don't fetch without a token
        populationAgeChart(token, setData, setError, setIsLoading);
    }, [token]);

    if (isLoading || !data) return <SkeletonComponent />;

    // 1. Get unique drug keys (excludes "Geopolitical Zone")
    const drugs = getUniqueKeys(data);

    // 2. Generate one color per drug
    const colors = generateHexColors(drugs.length);

    // 3. Normalize data: rename "Geopolitical Zone" -> "location"
    //    and convert string counts to numbers
    const normalizedData = data.map(row => {
        const { 'Age Disaggregation': zone, ...rest } = row;
        const numeric = {};
        for (const key in rest) {
        numeric[key] = Number(rest[key]) || 0;
        }
        return { location: zone, ...numeric };
    });

    return (
        <ResponsiveContainer width="100%" height={400}>
        <BarChart data={normalizedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis
            allowDecimals={false}
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            {drugs.map((drug, i) => (
            <Bar
                key={drug}
                dataKey={drug}
                stackId="drugs"
                fill={colors[i]}
            />
            ))}
        </BarChart>
        </ResponsiveContainer>
    );
};

export default AgeCategoryChart;